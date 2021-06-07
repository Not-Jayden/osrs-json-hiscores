import { Player, Stats, Gamemode, SkillName, PlayerSkillRow, ActivityName, PlayerActivityRow } from './types';
/**
 * Screen scrapes the hiscores to get the formatted rsn of a player.
 *
 * @param rsn Username of the player.
 * @returns Formatted version of the rsn.
 */
export declare function getRSNFormat(rsn: string): Promise<string>;
/**
 * Parses CSV string of raw stats and returns a stats object.
 *
 * @param csv Raw CSV from the official OSRS API.
 * @returns Parsed stats object.
 */
export declare function parseStats(csv: string, mode?: Gamemode): Stats;
/**
 * Fetches stats from the OSRS API and consolidates the info into a player object.
 *
 * **Note:** This function will make up to 5 separate network requests.
 * As such, it is highly subject to the performance of the official OSRS API.
 *
 * @param rsn Username of the player.
 * @returns Player object.
 */
export declare function getStats(rsn: string): Promise<Player>;
/**
 * Fetches stats from the OSRS API and returns them as an object.
 *
 * @param rsn Username of the player.
 * @param mode Gamemode to fetch ranks for.
 * @returns Stats object.
 */
export declare function getStatsByGamemode(rsn: string, mode?: Gamemode): Promise<Stats>;
export declare function getSkillPage(skill: SkillName, mode?: Gamemode, page?: number): Promise<PlayerSkillRow[]>;
/**
 * Screen scrapes a hiscores page of an activity or boss and returns an array of up to 25 players.
 *
 * @param activity Name of the activity or boss to fetch hiscores for.
 * @param mode Gamemode to fetch ranks for.
 * @param page Page number.
 * @returns Array of `PlayerActivityRow` objects.
 */
export declare function getActivityPage(activity: ActivityName, mode?: Gamemode, page?: number): Promise<PlayerActivityRow[]>;
