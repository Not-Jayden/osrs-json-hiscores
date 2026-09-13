import { expect, test } from 'vitest';

/* eslint-disable import/extensions -- the scripts are .mjs, imported from TS */
import {
  keygen,
  keyOf,
  renderBosses,
  renderBossesTable
} from '../scripts/regen-content.mjs';
import {
  BOSSES,
  FORMATTED_BOSS_NAMES,
  FORMATTED_SKILL_NAMES,
  SKILLS
} from '../src/index.js';

test('keygen reproduces every shipped key', () => {
  expect(SKILLS.map((key) => keyOf(FORMATTED_SKILL_NAMES[key]))).toStrictEqual([
    ...SKILLS
  ]);
  expect(BOSSES.map((key) => keyOf(FORMATTED_BOSS_NAMES[key]))).toStrictEqual([
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

test('rendering the shipped content reproduces the keys and names', () => {
  const entries = BOSSES.map((key) => [key, FORMATTED_BOSS_NAMES[key]]);

  const rendered = renderBosses(entries);
  expect(rendered.match(/^ {2}'\w+',$/gm)).toStrictEqual(
    BOSSES.map((key) => `  '${key}',`)
  );
  expect(rendered).toContain(`calvarion: "Calvar'ion",`);

  const table = renderBossesTable(entries).split('\n');
  expect(table).toHaveLength(BOSSES.length + 2);
  expect(table[2]).toBe('| Abyssal Sire | `abyssalSire` |');
});
