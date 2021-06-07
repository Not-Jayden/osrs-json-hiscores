"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FORMATTED_LEAGUE_POINTS = exports.FORMATTED_SOUL_WARS = exports.FORMATTED_LMS = exports.FORMATTED_BH_NAMES = exports.FORMATTED_CLUE_NAMES = exports.FORMATTED_SKILL_NAMES = exports.FORMATTED_BOSS_NAMES = exports.ACTIVITIES = exports.BOSSES = exports.GAMEMODES = exports.BH_MODES = exports.CLUES = exports.SKILLS = exports.GAMEMODE_URL = exports.SCORES_URL = exports.STATS_URL = exports.BASE_URL = void 0;
exports.BASE_URL = 'https://secure.runescape.com/m=hiscore_oldschool';
exports.STATS_URL = 'index_lite.ws?player=';
exports.SCORES_URL = 'overall.ws?';
exports.GAMEMODE_URL = {
    main: exports.BASE_URL + "/",
    ironman: exports.BASE_URL + "_ironman/",
    hardcore: exports.BASE_URL + "_hardcore_ironman/",
    ultimate: exports.BASE_URL + "_ultimate/",
    deadman: exports.BASE_URL + "_deadman/",
    seasonal: exports.BASE_URL + "_seasonal/",
    tournament: exports.BASE_URL + "_tournament/"
};
exports.SKILLS = [
    'overall',
    'attack',
    'defence',
    'strength',
    'hitpoints',
    'ranged',
    'prayer',
    'magic',
    'cooking',
    'woodcutting',
    'fletching',
    'fishing',
    'firemaking',
    'crafting',
    'smithing',
    'mining',
    'herblore',
    'agility',
    'thieving',
    'slayer',
    'farming',
    'runecraft',
    'hunter',
    'construction'
];
exports.CLUES = [
    'all',
    'beginner',
    'easy',
    'medium',
    'hard',
    'elite',
    'master'
];
exports.BH_MODES = ['hunter', 'rogue'];
exports.GAMEMODES = [
    'main',
    'ironman',
    'hardcore',
    'ultimate',
    'deadman',
    'seasonal',
    'tournament'
];
exports.BOSSES = [
    'abyssalSire',
    'alchemicalHydra',
    'barrows',
    'bryophyta',
    'callisto',
    'cerberus',
    'chambersOfXeric',
    'chambersOfXericChallengeMode',
    'chaosElemental',
    'chaosFanatic',
    'commanderZilyana',
    'corporealBeast',
    'crazyArchaeologist',
    'dagannothPrime',
    'dagannothRex',
    'dagannothSupreme',
    'derangedArchaeologist',
    'generalGraardor',
    'giantMole',
    'grotesqueGuardians',
    'hespori',
    'kalphiteQueen',
    'kingBlackDragon',
    'kraken',
    'kreeArra',
    'krilTsutsaroth',
    'mimic',
    'nightmare',
    'obor',
    'sarachnis',
    'scorpia',
    'skotizo',
    'tempoross',
    'gauntlet',
    'corruptedGauntlet',
    'theatreOfBlood',
    'theatreOfBloodHardMode',
    'thermonuclearSmokeDevil',
    'tzKalZuk',
    'tzTokJad',
    'venenatis',
    'vetion',
    'vorkath',
    'wintertodt',
    'zalcano',
    'zulrah'
];
exports.ACTIVITIES = __spreadArray([
    'leaguePoints',
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
    'soulWarsZeal'
], exports.BOSSES);
exports.FORMATTED_BOSS_NAMES = {
    abyssalSire: 'Abyssal Sire',
    alchemicalHydra: 'Alchemical Hydra',
    barrows: 'Barrows Chests',
    bryophyta: 'Bryophyta',
    callisto: 'Callisto',
    cerberus: 'Cerberus',
    chambersOfXeric: 'Chambers of Xeric',
    chambersOfXericChallengeMode: 'Chambers of Xeric: Challenge Mode',
    chaosElemental: 'Chaos Elemental',
    chaosFanatic: 'Chaos Fanatic',
    commanderZilyana: 'Commander Zilyana',
    corporealBeast: 'Corporeal Beast',
    crazyArchaeologist: 'Crazy Archaeologist',
    dagannothPrime: 'Dagannoth Prime',
    dagannothRex: 'Dagannoth Rex',
    dagannothSupreme: 'Dagannoth Supreme',
    derangedArchaeologist: 'Deranged Archaeologist',
    generalGraardor: 'General Graardor',
    giantMole: 'Giant Mole',
    grotesqueGuardians: 'Grotesque Guardians',
    hespori: 'Hespori',
    kalphiteQueen: 'Kalphite Queen',
    kingBlackDragon: 'King Black Dragon',
    kraken: 'Kraken',
    kreeArra: "Kree'Arra",
    krilTsutsaroth: "K'ril Tsutsaroth",
    mimic: 'Mimic',
    nightmare: 'The Nightmare of Ashihama',
    obor: 'Obor',
    sarachnis: 'Sarachnis',
    scorpia: 'Scorpia',
    skotizo: 'Skotizo',
    tempoross: 'Tempoross',
    gauntlet: 'The Gauntlet',
    corruptedGauntlet: 'The Corrupted Gauntlet',
    theatreOfBlood: 'Theatre of Blood',
    theatreOfBloodHardMode: 'Theatre of Blood: Hard Mode',
    thermonuclearSmokeDevil: 'Thermonuclear Smoke Devil',
    tzKalZuk: 'TzKal-Zuk',
    tzTokJad: 'TzTok-Jad',
    venenatis: 'Venenatis',
    vetion: "Vet'ion",
    vorkath: 'Vorkath',
    wintertodt: 'Wintertodt',
    zalcano: 'Zalcano',
    zulrah: 'Zulrah'
};
exports.FORMATTED_SKILL_NAMES = {
    overall: 'Overall',
    attack: 'Attack',
    defence: 'Defence',
    strength: 'Strength',
    hitpoints: 'Hitpoints',
    ranged: 'Ranged',
    prayer: 'Prayer',
    magic: 'Magic',
    cooking: 'Cooking',
    woodcutting: 'Woodcutting',
    fletching: 'Fletching',
    fishing: 'Fishing',
    firemaking: 'Firemaking',
    crafting: 'Crafting',
    smithing: 'Smithing',
    mining: 'Mining',
    herblore: 'Herblore',
    agility: 'Agility',
    thieving: 'Thieving',
    slayer: 'Slayer',
    farming: 'Farming',
    runecraft: 'Runecraft',
    hunter: 'Hunter',
    construction: 'Construction'
};
exports.FORMATTED_CLUE_NAMES = {
    all: 'Clue Scrolls (all)',
    beginner: 'Clue Scrolls (beginner)',
    easy: 'Clue Scrolls (easy)',
    medium: 'Clue Scrolls (medium)',
    hard: 'Clue Scrolls (hard)',
    elite: 'Clue Scrolls (elite)',
    master: 'Clue Scrolls (master)'
};
exports.FORMATTED_BH_NAMES = {
    rogue: 'Bounty Hunter - Rogue',
    hunter: 'Bounty Hunter - Hunter'
};
exports.FORMATTED_LMS = 'Last Man Standing';
exports.FORMATTED_SOUL_WARS = 'Soul Wars Zeal';
exports.FORMATTED_LEAGUE_POINTS = 'League Points';