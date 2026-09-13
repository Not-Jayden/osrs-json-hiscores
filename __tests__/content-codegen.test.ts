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

test('regeneration refuses content it cannot reproduce', () => {
  const one = [['araxxor', 'Araxxor']] as [string, string][];

  expect(() => validate('bosses', one, { brutus: 'Brutus' })).toThrow(
    /dropped/
  );
  expect(() => validate('bosses', [...one, ...one], {})).toThrow(/duplicate/);
  expect(() =>
    validate('bosses', [['tzKalZuk', 'TzKal-Zuk']], {
      tzkalzuk: 'TzKal-Zuk'
    })
  ).toThrow(/no longer reproduces/);
});
