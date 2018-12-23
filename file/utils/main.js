import { Client } from "discord.js";

const cl = new Client();

/**
 * Logs in the bot client
 * @param {string} token The bot's token
 */
export const login = token => {
   cl.login(token);
};

/**
 * Handle d.js events
 * @param {string} event Event to handle
 * @param {function} func Event handler function
 */
export const on = (event, func) => {
   cl.on(event, func);
};

/**
 * Checks to see if the provided element is an array
 * @param {?} array The element to be checked
 * @returns {bool} true / false depending on the element
 */
export const isArr = array => {
   return Array.isArray(array);
};

/**
 * Checks to see if the provided element is an object
 * @param {?} object The element to be checked
 * @returns {bool} true / false depending on the element
 */
export const isObj = object => {
   return !Array.isArray(object) && typeof object === "object";
};

/**
 * Checks to see if the provided element is a string
 * @param {?} string The element to be checked
 * @returns {bool} true / false depending on the element
 */
export const isStr = string => {
      return typeof string === "string";
};

/**
 * Checks to see if the provided argument is a mention
 * @param {object} msg The msg object for getting the member object
 * @param {string} argument The argument to be checked
 * @returns {bool} Returns the member object if true or false if not
 */
export const isMention = (msg, argument) => {
   const userID = argument.replace(/[<@!>]/gu, "");
   let mention = false;

   if (msg.guild.member(userID)) {
      mention = msg.guild.member(userID);
   }
   return mention;
};

/**
 * Log something to the console
 * @param {?} toLog What to log
 */
export const log = (toLog) => {
   console.log(toLog);
};
