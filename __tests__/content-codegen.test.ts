/* eslint-disable import/extensions -- the scripts are .mjs, imported from TS */
import prettier from 'prettier';
import { expect, test } from 'vitest';

import {
  keygen,
  keyOf,
  renderBosses,
  renderBossesTable,
  validate
} from '../scripts/regen-content.mjs';
import { prBody } from '../scripts/codegen-content-pr.mjs';
import { FIXED_ACTIVITIES } from '../src/utils/generated/activities.js';
import {
  ACTIVITIES,
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

test('the generated fixed list is the head of ACTIVITIES, in hiscores order', () => {
  // ACTIVITIES is [...FIXED_ACTIVITIES, ...BOSSES], and getActivityPageURL passes
  // ACTIVITIES.indexOf(boss) as the hiscores table= number: the fixed order is not
  // cosmetic.
  expect(ACTIVITIES.slice(0, FIXED_ACTIVITIES.length)).toStrictEqual([
    ...FIXED_ACTIVITIES
  ]);
  expect(FIXED_ACTIVITIES.at(-1)).toBe('collectionsLogged');
  expect(FIXED_ACTIVITIES[0]).toBe('gridPoints');
});

test('every shipped fixed key is reproduced by the rule or the override table', () => {
  // The twenty legacy keys: thirteen from KEY_OVERRIDES, seven from the rule.
  const byRule = {
    'Grid Points': 'gridPoints',
    'League Points': 'leaguePoints',
    'Deadman Points': 'deadmanPoints',
    'Soul Wars Zeal': 'soulWarsZeal',
    'Rifts closed': 'riftsClosed',
    'Colosseum Glory': 'colosseumGlory',
    'Collections Logged': 'collectionsLogged'
  };
  const byTable = {
    'Bounty Hunter - Hunter': 'hunterBHV2',
    'Bounty Hunter - Rogue': 'rogueBHV2',
    'Bounty Hunter (Legacy) - Hunter': 'hunterBH',
    'Bounty Hunter (Legacy) - Rogue': 'rogueBH',
    'Clue Scrolls (all)': 'allClues',
    'Clue Scrolls (beginner)': 'beginnerClues',
    'Clue Scrolls (easy)': 'easyClues',
    'Clue Scrolls (medium)': 'mediumClues',
    'Clue Scrolls (hard)': 'hardClues',
    'Clue Scrolls (elite)': 'eliteClues',
    'Clue Scrolls (master)': 'masterClues',
    'LMS - Rank': 'lastManStanding',
    'PvP Arena - Rank': 'pvpArena'
  };

  Object.entries(byRule).forEach(([name, key]) =>
    expect(keygen(name)).toBe(key)
  );
  Object.entries(byTable).forEach(([name, key]) =>
    expect(keyOf(name)).toBe(key)
  );
  expect(Object.keys(byRule).length + Object.keys(byTable).length).toBe(
    FIXED_ACTIVITIES.length
  );
});

test('the PR body carries the notes and nothing else', () => {
  const body = prBody('feat: add Zulrah', ['a note']);

  expect(body).toContain('Verify before merging:\n- a note');
  expect(body).toContain('- [ ] Merge as a minor release');
  expect(body).not.toContain('Hand-written');
});

test('regeneration refuses content it cannot reproduce', () => {
  const one = [['araxxor', 'Araxxor']] as [string, string][];

  expect(() => validate('bosses', one, { brutus: 'Brutus' })).toThrow(
    /dropped/
  );
  expect(() => validate('bosses', [...one, ...one], {})).toThrow(/duplicate/);
  // A boss whose key collides with a fixed activity ships ACTIVITIES with the key
  // twice, and indexOf then resolves to the fixed entry ahead of the boss.
  expect(() =>
    validate(
      'activities',
      [
        ['riftsClosed', 'Rifts Closed'],
        ['riftsClosed', 'Rifts Closed']
      ],
      {}
    )
  ).toThrow(/duplicate/);
  expect(() =>
    validate('bosses', [['tzKalZuk', 'TzKal-Zuk']], {
      tzkalzuk: 'TzKal-Zuk'
    })
  ).toThrow(/no longer reproduces/);
});
