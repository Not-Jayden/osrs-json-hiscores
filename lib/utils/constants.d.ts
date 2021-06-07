import { BHType, Boss, ClueType, Gamemode, SkillName, ActivityName } from '../types';
export declare const BASE_URL = "https://secure.runescape.com/m=hiscore_oldschool";
export declare const STATS_URL = "index_lite.ws?player=";
export declare const SCORES_URL = "overall.ws?";
export declare type GamemodeUrl = {
    [key in Gamemode]: string;
};
export declare const GAMEMODE_URL: GamemodeUrl;
export declare const SKILLS: SkillName[];
export declare const CLUES: ClueType[];
export declare const BH_MODES: BHType[];
export declare const GAMEMODES: Gamemode[];
export declare const BOSSES: Boss[];
export declare const ACTIVITIES: ActivityName[];
export declare type FormattedBossNames = {
    [key in Boss]: string;
};
export declare const FORMATTED_BOSS_NAMES: FormattedBossNames;
export declare type FormattedSkillNames = {
    [key in SkillName]: string;
};
export declare const FORMATTED_SKILL_NAMES: FormattedSkillNames;
export declare type FormattedClueNames = {
    [key in ClueType]: string;
};
export declare const FORMATTED_CLUE_NAMES: FormattedClueNames;
export declare type FormattedBHNames = {
    [key in BHType]: string;
};
export declare const FORMATTED_BH_NAMES: FormattedBHNames;
export declare const FORMATTED_LMS = "Last Man Standing";
export declare const FORMATTED_SOUL_WARS = "Soul Wars Zeal";
export declare const FORMATTED_LEAGUE_POINTS = "League Points";
