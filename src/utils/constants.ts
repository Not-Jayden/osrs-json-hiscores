import { BOSSES } from './generated/bosses.js';

// Endpoint-derived content lives in ./generated — regenerate with scripts/regen-content.mjs.
export * from './generated/bosses.js';
export * from './generated/skills.js';

export const BASE_URL = 'https://secure.runescape.com/m=hiscore_oldschool';
export const JSON_STATS_URL = 'index_lite.json?player=';
export const SCORES_URL = 'overall.ws?';

export type GamemodeUrl = {
  [key in Gamemode]: string;
};

export const GAMEMODE_URL: GamemodeUrl = {
  main: `${BASE_URL}/`,
  ironman: `${BASE_URL}_ironman/`,
  hardcore: `${BASE_URL}_hardcore_ironman/`,
  ultimate: `${BASE_URL}_ultimate/`,
  deadman: `${BASE_URL}_deadman/`,
  seasonal: `${BASE_URL}_seasonal/`,
  tournament: `${BASE_URL}_tournament/`,
  skiller: `${BASE_URL}_skiller/`,
  oneDefence: `${BASE_URL}_skiller_defence/`,
  freshStart: `${BASE_URL}_fresh_start/`
};

export const CLUES = [
  'all',
  'beginner',
  'easy',
  'medium',
  'hard',
  'elite',
  'master'
] as const;
export type ClueType = (typeof CLUES)[number];
export const BH_MODES = ['hunterV2', 'rogueV2', 'hunter', 'rogue'] as const;
export type BHType = (typeof BH_MODES)[number];
export const GAMEMODES = [
  'main',
  'ironman',
  'hardcore',
  'ultimate',
  'deadman',
  'seasonal',
  'tournament',
  'skiller',
  'oneDefence',
  'freshStart'
] as const;
export type Gamemode = (typeof GAMEMODES)[number];

export const ACTIVITIES = [
  'gridPoints',
  'leaguePoints',
  'deadmanPoints',
  'hunterBHV2',
  'rogueBHV2',
  'hunterBH',
  'rogueBH',
  'allClues',
  'beginnerClues',
  'easyClues',
  'mediumClues',
  'hardClues',
  'eliteClues',
  'masterClues',
  'lastManStanding',
  'pvpArena',
  'soulWarsZeal',
  'riftsClosed',
  'colosseumGlory',
  'collectionsLogged',
  ...BOSSES
] as const;
export type ActivityName = (typeof ACTIVITIES)[number];

export type FormattedClueNames = {
  [key in ClueType]: string;
};

export const FORMATTED_CLUE_NAMES: FormattedClueNames = {
  all: 'Clue Scrolls (all)',
  beginner: 'Clue Scrolls (beginner)',
  easy: 'Clue Scrolls (easy)',
  medium: 'Clue Scrolls (medium)',
  hard: 'Clue Scrolls (hard)',
  elite: 'Clue Scrolls (elite)',
  master: 'Clue Scrolls (master)'
};

export type FormattedBHNames = {
  [key in BHType]: string;
};

export const FORMATTED_BH_NAMES: FormattedBHNames = {
  rogue: 'Bounty Hunter (Legacy) - Rogue',
  hunter: 'Bounty Hunter (Legacy) - Hunter',
  rogueV2: 'Bounty Hunter - Rogue',
  hunterV2: 'Bounty Hunter - Hunter'
};

export const FORMATTED_LMS = 'LMS - Rank';
export const FORMATTED_PVP_ARENA = 'PvP Arena - Rank';
export const FORMATTED_SOUL_WARS = 'Soul Wars Zeal';
export const FORMATTED_LEAGUE_POINTS = 'League Points';
export const FORMATTED_DEADMAN_POINTS = 'Deadman Points';
export const FORMATTED_RIFTS_CLOSED = 'Rifts closed';
export const FORMATTED_COLOSSEUM_GLORY = 'Colosseum Glory';
export const FORMATTED_COLLECTIONS_LOGGED = 'Collections Logged';

const PLAYER_NOT_FOUND_ERROR = 'Player not found';
const HISCORES_ERROR = 'HiScores not responding';

export class InvalidRSNError extends Error {}

export class PlayerNotFoundError extends Error {
  constructor() {
    super(PLAYER_NOT_FOUND_ERROR);
  }
}

export class HiScoresError extends Error {
  constructor() {
    super(HISCORES_ERROR);
  }
}
