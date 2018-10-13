let ds = require("discord.js");
let cl = new ds.Client();

exports.login = (token) => cl.login(token);
exports.on = (event, func) => cl.on(event, func);
exports.isArr = (array) => { return Array.isArray(array); };
exports.isObj = (object) => { return !Array.isArray(object) && typeof object === "object"; };
exports.isStr = (string) => { return typeof string === "string"; };