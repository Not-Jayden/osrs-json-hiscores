export declare type Gamemode = 'main' | 'ironman' | 'ultimate' | 'hardcore' | 'deadman' | 'seasonal' | 'tournament';
export interface Skill {
    rank: number;
    level: number;
    xp: number;
}
export interface Activity {
    rank: number;
    score: number;
}
export declare type SkillName = 'overall' | 'attack' | 'defence' | 'strength' | 'hitpoints' | 'ranged' | 'prayer' | 'magic' | 'cooking' | 'woodcutting' | 'fletching' | 'fishing' | 'firemaking' | 'crafting' | 'smithing' | 'mining' | 'herblore' | 'agility' | 'thieving' | 'slayer' | 'farming' | 'runecraft' | 'hunter' | 'construction';
export declare type Skills = {
    [Name in SkillName]: Skill;
};
export declare type ClueType = 'all' | 'beginner' | 'easy' | 'medium' | 'hard' | 'elite' | 'master';
export declare type Clues = {
    [Type in ClueType]: Activity;
};
export declare type BHType = 'rogue' | 'hunter';
export declare type BH = {
    [Type in BHType]: Activity;
};
export declare type Boss = 'abyssalSire' | 'alchemicalHydra' | 'barrows' | 'bryophyta' | 'callisto' | 'cerberus' | 'chambersOfXeric' | 'chambersOfXericChallengeMode' | 'chaosElemental' | 'chaosFanatic' | 'commanderZilyana' | 'corporealBeast' | 'crazyArchaeologist' | 'dagannothPrime' | 'dagannothRex' | 'dagannothSupreme' | 'derangedArchaeologist' | 'generalGraardor' | 'giantMole' | 'grotesqueGuardians' | 'hespori' | 'kalphiteQueen' | 'kingBlackDragon' | 'kraken' | 'kreeArra' | 'krilTsutsaroth' | 'mimic' | 'nightmare' | 'obor' | 'sarachnis' | 'scorpia' | 'skotizo' | 'tempoross' | 'gauntlet' | 'corruptedGauntlet' | 'theatreOfBlood' | 'theatreOfBloodHardMode' | 'thermonuclearSmokeDevil' | 'tzKalZuk' | 'tzTokJad' | 'venenatis' | 'vetion' | 'vorkath' | 'wintertodt' | 'zalcano' | 'zulrah';
export declare type Bosses = {
    [Type in Boss]: Activity;
};
export declare type ActivityName = 'leaguePoints' | 'hunterBH' | 'rogueBH' | 'lastManStanding' | 'soulWarsZeal' | 'allClues' | 'beginnerClues' | 'easyClues' | 'mediumClues' | 'hardClues' | 'eliteClues' | 'masterClues' | Boss;
export interface Stats {
    skills: Skills;
    clues: Clues;
    leaguePoints: Activity;
    bountyHunter: BH;
    lastManStanding: Activity;
    soulWarsZeal: Activity;
    bosses: Bosses;
}
export declare type Modes = {
    [M in Gamemode]?: Stats;
};
export interface Player extends Modes {
    name: string;
    mode: Gamemode;
    dead: boolean;
    deulted: boolean;
    deironed: boolean;
}
export interface PlayerSkillRow extends Skill {
    name: string;
    dead: boolean;
}
export interface PlayerActivityRow extends Activity {
    name: string;
    dead: boolean;
}
