"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityPage = exports.getSkillPage = exports.getStatsByGamemode = exports.getStats = exports.parseStats = exports.getRSNFormat = void 0;
var jsdom_1 = require("jsdom");
var utils_1 = require("./utils");
/**
 * Screen scrapes the hiscores to get the formatted rsn of a player.
 *
 * @param rsn Username of the player.
 * @returns Formatted version of the rsn.
 */
function getRSNFormat(rsn) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, dom, spans, nameSpan, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (typeof rsn !== 'string') {
                        throw Error('RSN must be a string');
                    }
                    else if (!/^[a-zA-Z0-9 _-]+$/.test(rsn)) {
                        throw Error('RSN contains invalid character');
                    }
                    else if (rsn.length > 12 || rsn.length < 1) {
                        throw Error('RSN must be between 1 and 12 characters');
                    }
                    url = utils_1.getPlayerTableURL('main', rsn);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, utils_1.httpGet(url)];
                case 2:
                    response = _b.sent();
                    dom = new jsdom_1.JSDOM(response.data);
                    spans = dom.window.document.querySelectorAll('span[style="color:#AA0022;"]');
                    if (spans.length >= 2) {
                        nameSpan = spans[1];
                        return [2 /*return*/, utils_1.rsnFromElement(nameSpan)];
                    }
                    throw Error('Player not found');
                case 3:
                    _a = _b.sent();
                    throw Error('Player not found');
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getRSNFormat = getRSNFormat;
/**
 * Parses CSV string of raw stats and returns a stats object.
 *
 * @param csv Raw CSV from the official OSRS API.
 * @returns Parsed stats object.
 */
function parseStats(csv, mode) {
    if (mode === void 0) { mode = 'main'; }
    var splitCSV = csv
        .split('\n')
        .filter(function (entry) { return !!entry; })
        .map(function (stat) { return stat.split(','); });
    var skillObjects = splitCSV
        .filter(function (stat) { return stat.length === 3; })
        .map(function (stat) {
        var rank = stat[0], level = stat[1], xp = stat[2];
        var skill = {
            rank: parseInt(rank, 10),
            level: parseInt(level, 10),
            xp: parseInt(xp, 10)
        };
        return skill;
    });
    var activityObjects = splitCSV
        .filter(function (stat) { return stat.length === 2; })
        .map(function (stat) {
        var rank = stat[0], score = stat[1];
        var activity = {
            rank: parseInt(rank, 10),
            score: parseInt(score, 10)
        };
        return activity;
    });
    var filteredBosses = mode === 'seasonal'
        ? utils_1.BOSSES.filter(function (boss) { return boss !== 'tempoross'; })
        : utils_1.BOSSES;
    var leaguePoints = activityObjects.splice(0, 1)[0];
    var bhObjects = activityObjects.splice(0, utils_1.BH_MODES.length);
    var clueObjects = activityObjects.splice(0, utils_1.CLUES.length);
    var _a = activityObjects.splice(0, 2), lastManStanding = _a[0], soulWarsZeal = _a[1];
    var bossObjects = activityObjects.splice(0, filteredBosses.length);
    var skills = skillObjects.reduce(function (prev, curr, index) {
        var newSkills = __assign({}, prev);
        newSkills[utils_1.SKILLS[index]] = curr;
        return newSkills;
    }, {});
    var bountyHunter = bhObjects.reduce(function (prev, curr, index) {
        var newBH = __assign({}, prev);
        newBH[utils_1.BH_MODES[index]] = curr;
        return newBH;
    }, {});
    var clues = clueObjects.reduce(function (prev, curr, index) {
        var newClues = __assign({}, prev);
        newClues[utils_1.CLUES[index]] = curr;
        return newClues;
    }, {});
    var bosses = bossObjects.reduce(function (prev, curr, index) {
        var newBosses = __assign({}, prev);
        newBosses[filteredBosses[index]] = curr;
        return newBosses;
    }, {});
    var stats = {
        skills: skills,
        leaguePoints: leaguePoints,
        bountyHunter: bountyHunter,
        lastManStanding: lastManStanding,
        soulWarsZeal: soulWarsZeal,
        clues: clues,
        bosses: bosses
    };
    return stats;
}
exports.parseStats = parseStats;
/**
 * Fetches stats from the OSRS API and consolidates the info into a player object.
 *
 * **Note:** This function will make up to 5 separate network requests.
 * As such, it is highly subject to the performance of the official OSRS API.
 *
 * @param rsn Username of the player.
 * @returns Player object.
 */
function getStats(rsn) {
    return __awaiter(this, void 0, void 0, function () {
        var mainRes, otherResponses, ironRes, hcRes, ultRes, formattedName, player;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof rsn !== 'string') {
                        throw Error('RSN must be a string');
                    }
                    else if (!/^[a-zA-Z0-9 _]+$/.test(rsn)) {
                        throw Error('RSN contains invalid character');
                    }
                    else if (rsn.length > 12 || rsn.length < 1) {
                        throw Error('RSN must be between 1 and 12 characters');
                    }
                    return [4 /*yield*/, utils_1.httpGet(utils_1.getStatsURL('main', rsn))];
                case 1:
                    mainRes = _a.sent();
                    if (!(mainRes.status === 200)) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all([
                            utils_1.httpGet(utils_1.getStatsURL('ironman', rsn)).catch(function (err) { return err; }),
                            utils_1.httpGet(utils_1.getStatsURL('hardcore', rsn)).catch(function (err) { return err; }),
                            utils_1.httpGet(utils_1.getStatsURL('ultimate', rsn)).catch(function (err) { return err; }),
                            getRSNFormat(rsn).catch(function () { return undefined; })
                        ])];
                case 2:
                    otherResponses = _a.sent();
                    ironRes = otherResponses[0], hcRes = otherResponses[1], ultRes = otherResponses[2], formattedName = otherResponses[3];
                    player = {
                        name: formattedName !== null && formattedName !== void 0 ? formattedName : rsn,
                        mode: 'main',
                        dead: false,
                        deulted: false,
                        deironed: false
                    };
                    player.main = parseStats(mainRes.data);
                    if (ironRes.status === 200) {
                        player.ironman = parseStats(ironRes.data);
                        if (hcRes.status === 200) {
                            player.mode = 'hardcore';
                            player.hardcore = parseStats(hcRes.data);
                            if (player.ironman.skills.overall.xp !== player.hardcore.skills.overall.xp) {
                                player.dead = true;
                                player.mode = 'ironman';
                            }
                            if (player.main.skills.overall.xp !== player.ironman.skills.overall.xp) {
                                player.deironed = true;
                                player.mode = 'main';
                            }
                        }
                        else if (ultRes.status === 200) {
                            player.mode = 'ultimate';
                            player.ultimate = parseStats(ultRes.data);
                            if (player.ironman.skills.overall.xp !== player.ultimate.skills.overall.xp) {
                                player.deulted = true;
                                player.mode = 'ironman';
                            }
                            if (player.main.skills.overall.xp !== player.ironman.skills.overall.xp) {
                                player.deironed = true;
                                player.mode = 'main';
                            }
                        }
                        else {
                            player.mode = 'ironman';
                            if (player.main.skills.overall.xp !== player.ironman.skills.overall.xp) {
                                player.deironed = true;
                                player.mode = 'main';
                            }
                        }
                    }
                    return [2 /*return*/, player];
                case 3: throw Error('Player not found');
            }
        });
    });
}
exports.getStats = getStats;
/**
 * Fetches stats from the OSRS API and returns them as an object.
 *
 * @param rsn Username of the player.
 * @param mode Gamemode to fetch ranks for.
 * @returns Stats object.
 */
function getStatsByGamemode(rsn, mode) {
    if (mode === void 0) { mode = 'main'; }
    return __awaiter(this, void 0, void 0, function () {
        var response, stats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof rsn !== 'string') {
                        throw Error('RSN must be a string');
                    }
                    else if (!/^[a-zA-Z0-9 _]+$/.test(rsn)) {
                        throw Error('RSN contains invalid character');
                    }
                    else if (rsn.length > 12 || rsn.length < 1) {
                        throw Error('RSN must be between 1 and 12 characters');
                    }
                    else if (!utils_1.GAMEMODES.includes(mode)) {
                        throw Error('Invalid game mode');
                    }
                    return [4 /*yield*/, utils_1.httpGet(utils_1.getStatsURL(mode, rsn))];
                case 1:
                    response = _a.sent();
                    if (response.status !== 200) {
                        throw Error('Player not found');
                    }
                    stats = parseStats(response.data, mode);
                    return [2 /*return*/, stats];
            }
        });
    });
}
exports.getStatsByGamemode = getStatsByGamemode;
function getSkillPage(skill, mode, page) {
    if (mode === void 0) { mode = 'main'; }
    if (page === void 0) { page = 1; }
    return __awaiter(this, void 0, void 0, function () {
        var url, response, dom, playersHTML, players;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!utils_1.GAMEMODES.includes(mode)) {
                        throw Error('Invalid game mode');
                    }
                    else if (!Number.isInteger(page) || page < 1) {
                        throw Error('Page must be an integer greater than 0');
                    }
                    else if (!utils_1.SKILLS.includes(skill)) {
                        throw Error('Invalid skill');
                    }
                    url = utils_1.getSkillPageURL(mode, skill, page);
                    return [4 /*yield*/, utils_1.httpGet(url)];
                case 1:
                    response = _a.sent();
                    dom = new jsdom_1.JSDOM(response.data);
                    playersHTML = dom.window.document.querySelectorAll('.personal-hiscores__row');
                    players = [];
                    playersHTML.forEach(function (row) {
                        var rankEl = row.querySelector('td');
                        var nameEl = row.querySelector('td a');
                        var levelEl = row.querySelector('td.left + td');
                        var xpEl = row.querySelector('td.left + td + td');
                        var isDead = !!row.querySelector('td img');
                        players.push({
                            name: utils_1.rsnFromElement(nameEl),
                            rank: utils_1.numberFromElement(rankEl),
                            level: utils_1.numberFromElement(levelEl),
                            xp: utils_1.numberFromElement(xpEl),
                            dead: isDead
                        });
                    });
                    return [2 /*return*/, players];
            }
        });
    });
}
exports.getSkillPage = getSkillPage;
/**
 * Screen scrapes a hiscores page of an activity or boss and returns an array of up to 25 players.
 *
 * @param activity Name of the activity or boss to fetch hiscores for.
 * @param mode Gamemode to fetch ranks for.
 * @param page Page number.
 * @returns Array of `PlayerActivityRow` objects.
 */
function getActivityPage(activity, mode, page) {
    if (mode === void 0) { mode = 'main'; }
    if (page === void 0) { page = 1; }
    return __awaiter(this, void 0, void 0, function () {
        var url, response, dom, playersHTML, players;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!utils_1.GAMEMODES.includes(mode)) {
                        throw Error('Invalid game mode');
                    }
                    else if (!Number.isInteger(page) || page < 1) {
                        throw Error('Page must be an integer greater than 0');
                    }
                    else if (!utils_1.ACTIVITIES.includes(activity)) {
                        throw Error('Invalid activity');
                    }
                    url = utils_1.getActivityPageURL(mode, activity, page);
                    return [4 /*yield*/, utils_1.httpGet(url)];
                case 1:
                    response = _a.sent();
                    dom = new jsdom_1.JSDOM(response.data);
                    playersHTML = dom.window.document.querySelectorAll('.personal-hiscores__row');
                    players = [];
                    playersHTML.forEach(function (row) {
                        var rankEl = row.querySelector('td');
                        var nameEl = row.querySelector('td a');
                        var scoreEl = row.querySelector('td.left + td');
                        var isDead = !!row.querySelector('td img');
                        players.push({
                            name: utils_1.rsnFromElement(nameEl),
                            rank: utils_1.numberFromElement(rankEl),
                            score: utils_1.numberFromElement(scoreEl),
                            dead: isDead
                        });
                    });
                    return [2 /*return*/, players];
            }
        });
    });
}
exports.getActivityPage = getActivityPage;