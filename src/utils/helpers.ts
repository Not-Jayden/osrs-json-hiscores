import { Node, TEXT_NODE } from 'ultrahtml';
import {
  Gamemode,
  SkillName,
  ActivityName,
  GAMEMODE_URL,
  STATS_URL,
  SCORES_URL,
  SKILLS,
  ACTIVITIES,
  JSON_STATS_URL,
  InvalidRSNError
} from './constants.js';

/**
 * Will generate a stats URL for the official OSRS API.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param rsn Username of the player.
 * @param json If the JSON endpoint is desired instead of CSV.
 * @returns Encoded stats URL.
 */
export const getStatsURL = (gamemode: Gamemode, rsn: string, json = false) =>
  `${GAMEMODE_URL[gamemode]}${
    json ? JSON_STATS_URL : STATS_URL
  }${encodeURIComponent(rsn)}`;

/**
 * Will generate a player table URL for the official OSRS hiscores website.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param rsn Username of the player.
 * @returns Encoded player table URL.
 */
export const getPlayerTableURL = (gamemode: Gamemode, rsn: string) =>
  `${GAMEMODE_URL[gamemode]}${SCORES_URL}table=0&user=${encodeURIComponent(
    rsn
  )}`;

/**
 * Will generate a skill table URL for the official OSRS hiscores website.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param skill Skill to fetch ranks for.
 * @param page Page number.
 * @returns
 */
export const getSkillPageURL = (
  gamemode: Gamemode,
  skill: SkillName,
  page: number
) =>
  `${GAMEMODE_URL[gamemode]}${SCORES_URL}table=${SKILLS.indexOf(
    skill
  )}&page=${page}`;

/**
 * Will generate an activity table URL for the official OSRS hiscores website.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param activity Activity or boss to fetch ranks for.
 * @param page Page number.
 * @returns
 */
export const getActivityPageURL = (
  gamemode: Gamemode,
  activity: ActivityName,
  page: number
) =>
  `${
    GAMEMODE_URL[gamemode]
  }${SCORES_URL}category_type=1&table=${ACTIVITIES.indexOf(
    activity
  )}&page=${page}`;

/**
 * Concatenates the text content of a node and all of its descendants.
 *
 * @param node Node to extract text from.
 * @returns Text content of the node.
 */
const textFromNode = (node: Node): string =>
  node.type === TEXT_NODE
    ? String(node.value)
    : ((node.children ?? []) as Node[]).map(textFromNode).join('');

/**
 * Extracts a number from an OSRS hiscores table cell element.
 *
 * @param el OSRS hiscores table cell element.
 * @returns Number parsed from cell text.
 */
export const numberFromElement = (el: Node | null) => {
  const number = el ? textFromNode(el).replace(/[\n|,]/g, '') : '-1';
  return parseInt(number, 10);
};

/**
 * Extracts a RSN from an OSRS hiscores table cell element.
 *
 * @param el OSRS hiscores table cell element.
 * @returns RSN parsed from cell text.
 */
export const rsnFromElement = (el: Node | null) =>
  el ? textFromNode(el).replace(/\uFFFD/g, ' ') : '';

/**
 * `ua.firefox(80)` inlined. Avoids pulling `useragent-generator` and its three
 * transitive dependencies in for a single static string.
 */
export const USER_AGENT =
  'Mozilla/5.0 (Windows NT 6.4; rv:80.0.0) Gecko/20100101 Firefox/80.0.0';

/**
 * Thrown when a hiscores request returns a non-2xx status.
 */
export class HttpError extends Error {
  constructor(public readonly status: number) {
    super(`Request failed with status code ${status}`);
    this.name = 'HttpError';
  }
}

/**
 * Runs a `GET` request against a given URL after injecting a `User-Agent` header.
 *
 * @param url URL to run a `GET` request against.
 * @returns Fetch response.
 */
export const httpGet = async (
  url: string,
  config: RequestInit = {}
): Promise<Response> => {
  const headers = new Headers(config.headers);
  // without User-Agent header requests may be rejected by DDoS protection mechanism
  if (!headers.has('user-agent')) headers.set('User-Agent', USER_AGENT);
  const response = await fetch(url, { ...config, headers });
  if (!response.ok) throw new HttpError(response.status);
  return response;
};

/**
 * Validates that a provided RSN has the same username restrictions as Jagex.
 * @param rsn Username to validate.
 * @throws Error if the RSN fails validation.
 */
export const validateRSN = (rsn: string) => {
  if (typeof rsn !== 'string') {
    throw new InvalidRSNError('RSN must be a string');
  } else if (!/^[a-zA-Z0-9 _-]+$/.test(rsn)) {
    throw new InvalidRSNError('RSN contains invalid character');
  } else if (rsn.length > 12 || rsn.length < 1) {
    throw new InvalidRSNError('RSN must be between 1 and 12 characters');
  }
};
