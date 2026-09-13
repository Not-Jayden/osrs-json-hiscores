/* eslint-disable import/extensions -- the scripts are .mjs, imported from TS */
import prettier from 'prettier';
import { expect, test } from 'vitest';

import {
  keygen,
  keyOf,
  manualEntries,
  misalignedActivities,
  renderBosses,
  renderBossesTable,
  validate
} from '../scripts/regen-content.mjs';
import { issueBody, prBody } from '../scripts/codegen-content-pr.mjs';
import {
  BOSSES,
  FORMATTED_BOSS_NAMES,
  FORMATTED_SKILL_NAMES,
  SKILLS
} from '../src/index.js';

const shippedBosses = BOSSES.map(
  (key) => [key, FORMATTED_BOSS_NAMES[key]] as [string, string]
);

test('keygen reproduces every shipped key', () => {
  expect(SKILLS.map((key) => keyOf(FORMATTED_SKILL_NAMES[key]))).toStrictEqual([
    ...SKILLS
  ]);
  expect(shippedBosses.map(([, name]) => keyOf(name))).toStrictEqual([
    ...BOSSES
  ]);
});

test('keygen follows the house rules', () => {
  expect(keygen('Araxxor')).toBe('araxxor');
  expect(keygen('The Leviathan')).toBe('leviathan');
  expect(keygen("Phosani's Nightmare")).toBe('phosanisNightmare');
  expect(keygen('Duke Sucellus')).toBe('dukeSucellus');
  expect(keygen("Vet'ion")).toBe('vetion');
  expect(keygen('TzKal-Zuk')).toBe('tzKalZuk');
  expect(keyOf('Barrows Chests')).toBe('barrows');
});

test('prettier leaves the rendered content in the shipped style', async () => {
  const entries: [string, string][] = [
    ['araxxor', 'Araxxor'],
    ['calvarion', "Calvar'ion"]
  ];
  const formatted = await prettier.format(renderBosses(entries), {
    ...(await prettier.resolveConfig('src/utils/generated/bosses.ts')),
    filepath: 'src/utils/generated/bosses.ts'
  });

  expect(formatted).toContain("araxxor: 'Araxxor',");
  expect(formatted).toContain(`calvarion: "Calvar'ion"`);
  expect(renderBossesTable(entries).split('\n')).toHaveLength(
    entries.length + 2
  );
});

test('rendered order is the endpoint order, never sorted', () => {
  // getActivityPageURL passes ACTIVITIES.indexOf(boss) as the hiscores `table=`
  // parameter, so BOSSES order is not cosmetic: sorting it here would send every
  // request after the inserted name to the wrong table.
  const entries: [string, string][] = [
    ['zulrah', 'Zulrah'],
    ['brutus', 'Brutus'],
    ['abyssalSire', 'Abyssal Sire']
  ];
  const rendered = renderBosses(entries);
  const positions = entries.map(([key]) => rendered.indexOf(key));

  expect(positions.every((at) => at > -1)).toBe(true);
  expect(positions).toStrictEqual([...positions].sort((a, b) => a - b));
});

test('a new fixed activity is reported with a key and its position', () => {
  // Grid Points has no constant in the package, so it must not be reported as new
  // on every single run.
  const fakeLib = {
    FORMATTED_CLUE_NAMES: { all: 'Clue Scrolls (all)' },
    FORMATTED_BH_NAMES: { hunter: 'Bounty Hunter (Legacy) - Hunter' },
    FORMATTED_LMS: 'LMS - Rank'
  };
  const live = [
    'Grid Points',
    'LMS - Rank',
    'Clue Scrolls (all)',
    'Plague Rift',
    'Bounty Hunter (Legacy) - Hunter'
  ];

  expect(manualEntries(live, fakeLib)).toStrictEqual([
    { name: 'Plague Rift', key: 'plagueRift', position: 3 }
  ]);
});

test('the PR body carries the lines to paste', () => {
  const body = prBody(
    'feat: add Zulrah',
    [],
    [{ name: 'Plague Rift', key: 'plagueRift', position: 3 }]
  );

  expect(body).toContain('## Hand-written entries needed');
  expect(body).toContain("'plagueRift',");
  expect(body).toContain("export const FORMATTED_PLAGUE_RIFT = 'Plague Rift';");
  expect(body).toContain('entry 4 of `ACTIVITIES`');
  expect(prBody('feat: add Zulrah', [])).not.toContain('Hand-written');

  // The issue is the artifact when a hand-written entry is the only finding.
  const issue = issueBody([
    { name: 'Plague Rift', key: 'plagueRift', position: 3 }
  ]);
  expect(issue).toContain('nothing to open a PR for');
  expect(issue).toContain(
    "export const FORMATTED_PLAGUE_RIFT = 'Plague Rift';"
  );
});

test('a key at the wrong table number is caught', () => {
  // `id` is the hiscores `table=` number, so a key the package puts at another
  // index would send that request to somebody else's table.
  const ordered = ['gridPoints', 'leaguePoints', 'plagueRift', 'lMSRank'];

  expect(
    misalignedActivities(
      [
        { id: 0, name: 'Grid Points' },
        { id: 1, name: 'League Points' },
        { id: 2, name: 'Plague Rift' },
        { id: 3, name: 'LMS - Rank' }
      ],
      ordered
    )
  ).toStrictEqual([]);

  // Hiscores call it table 3, the package puts it at 2: every request after it reads
  // the wrong table.
  expect(
    misalignedActivities([{ id: 3, name: 'Plague Rift' }], ordered)
  ).toStrictEqual([{ id: 3, name: 'Plague Rift' }]);

  // A name no rule can key is not judged at all.
  expect(
    misalignedActivities([{ id: 9, name: 'Mystery Thing' }], ordered)
  ).toStrictEqual([]);
});

test('regeneration refuses content it cannot reproduce', () => {
  const one = [['araxxor', 'Araxxor']] as [string, string][];

  expect(() => validate('bosses', one, { brutus: 'Brutus' })).toThrow(
    /dropped/
  );
  expect(() => validate('bosses', [...one, ...one], {})).toThrow(/duplicate/);
  // A boss whose key collides with a fixed activity: ACTIVITIES would carry it twice
  // and indexOf would resolve to the fixed entry ahead of it.
  expect(() =>
    validate('bosses', [['riftsClosed', 'Rifts Closed']], {}, ['riftsClosed'])
  ).toThrow(/duplicate/);
  expect(() =>
    validate('bosses', [['tzKalZuk', 'TzKal-Zuk']], {
      tzkalzuk: 'TzKal-Zuk'
    })
  ).toThrow(/no longer reproduces/);
});
