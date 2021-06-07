import { Gamemode, SkillName, ActivityName } from '../types';
/**
 * Will generate a stats URL for the official OSRS API.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param rsn Username of the player.
 * @returns Encoded stats URL.
 */
export declare const getStatsURL: (gamemode: Gamemode, rsn: string) => string;
/**
 * Will generate a player table URL for the official OSRS hiscores website.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param rsn Username of the player.
 * @returns Encoded player table URL.
 */
export declare const getPlayerTableURL: (gamemode: Gamemode, rsn: string) => string;
/**
 * Will generate a skill table URL for the official OSRS hiscores website.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param skill Skill to fetch ranks for.
 * @param page Page number.
 * @returns
 */
export declare const getSkillPageURL: (gamemode: Gamemode, skill: SkillName, page: number) => string;
/**
 * Will generate an activity table URL for the official OSRS hiscores website.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param activity Activity or boss to fetch ranks for.
 * @param page Page number.
 * @returns
 */
export declare const getActivityPageURL: (gamemode: Gamemode, activity: ActivityName, page: number) => string;
/**
 * Extracts a number from an OSRS hiscores table cell element.
 *
 * @param el OSRS hiscores table cell element.
 * @returns Number parsed from cell text.
 */
export declare const numberFromElement: (el: Element | null) => number;
/**
 * Extracts a RSN from an OSRS hiscores table cell element.
 *
 * @param el OSRS hiscores table cell element.
 * @returns RSN parsed from cell text.
 */
export declare const rsnFromElement: (el: Element | null) => string;
/**
 * Will run an Axios `GET` request against a given URL after injecting a `User-Agent` header.
 *
 * @param url URL to run a `GET` request against.
 * @returns Axios response.
 */
export declare const httpGet: (url: string) => Promise<import("axios").AxiosResponse<any>>;
