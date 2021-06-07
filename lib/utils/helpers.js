"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpGet = exports.rsnFromElement = exports.numberFromElement = exports.getActivityPageURL = exports.getSkillPageURL = exports.getPlayerTableURL = exports.getStatsURL = void 0;
var axios_1 = require("axios");
var ua = require("useragent-generator");
var constants_1 = require("./constants");
/**
 * Will generate a stats URL for the official OSRS API.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param rsn Username of the player.
 * @returns Encoded stats URL.
 */
var getStatsURL = function (gamemode, rsn) {
    return "" + constants_1.GAMEMODE_URL[gamemode] + constants_1.STATS_URL + encodeURIComponent(rsn);
};
exports.getStatsURL = getStatsURL;
/**
 * Will generate a player table URL for the official OSRS hiscores website.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param rsn Username of the player.
 * @returns Encoded player table URL.
 */
var getPlayerTableURL = function (gamemode, rsn) {
    return "" + constants_1.GAMEMODE_URL[gamemode] + constants_1.SCORES_URL + "table=0&user=" + encodeURIComponent(rsn);
};
exports.getPlayerTableURL = getPlayerTableURL;
/**
 * Will generate a skill table URL for the official OSRS hiscores website.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param skill Skill to fetch ranks for.
 * @param page Page number.
 * @returns
 */
var getSkillPageURL = function (gamemode, skill, page) {
    return "" + constants_1.GAMEMODE_URL[gamemode] + constants_1.SCORES_URL + "table=" + constants_1.SKILLS.indexOf(skill) + "&page=" + page;
};
exports.getSkillPageURL = getSkillPageURL;
/**
 * Will generate an activity table URL for the official OSRS hiscores website.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param activity Activity or boss to fetch ranks for.
 * @param page Page number.
 * @returns
 */
var getActivityPageURL = function (gamemode, activity, page) {
    return "" + constants_1.GAMEMODE_URL[gamemode] + constants_1.SCORES_URL + "category_type=1&table=" + constants_1.ACTIVITIES.indexOf(activity) + "&page=" + page;
};
exports.getActivityPageURL = getActivityPageURL;
/**
 * Extracts a number from an OSRS hiscores table cell element.
 *
 * @param el OSRS hiscores table cell element.
 * @returns Number parsed from cell text.
 */
var numberFromElement = function (el) {
    var _a;
    var innerHTML = (el !== null && el !== void 0 ? el : {}).innerHTML;
    var number = (_a = innerHTML === null || innerHTML === void 0 ? void 0 : innerHTML.replace(/[\n|,]/g, '')) !== null && _a !== void 0 ? _a : '-1';
    return parseInt(number, 10);
};
exports.numberFromElement = numberFromElement;
/**
 * Extracts a RSN from an OSRS hiscores table cell element.
 *
 * @param el OSRS hiscores table cell element.
 * @returns RSN parsed from cell text.
 */
var rsnFromElement = function (el) {
    var _a;
    var innerHTML = (el !== null && el !== void 0 ? el : {}).innerHTML;
    return (_a = innerHTML === null || innerHTML === void 0 ? void 0 : innerHTML.replace(/\uFFFD/g, ' ')) !== null && _a !== void 0 ? _a : '';
};
exports.rsnFromElement = rsnFromElement;
/**
 * Will run an Axios `GET` request against a given URL after injecting a `User-Agent` header.
 *
 * @param url URL to run a `GET` request against.
 * @returns Axios response.
 */
var httpGet = function (url) {
    return axios_1.default.get(url, {
        headers: {
            // without User-Agent header requests may be rejected by DDoS protection mechanism
            'User-Agent': ua.firefox(80)
        }
    });
};
exports.httpGet = httpGet;
