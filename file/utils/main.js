let ds = require("discord.js");
let cl = new ds.Client();


// #region d.js main
exports.login = (token) => cl.login(token);
exports.on = (event, func) => cl.on(event, func);
// #endregion

// #region JS
exports.isArr = (array) => { return Array.isArray(array); };
exports.isObj = (object) => { return !Array.isArray(object) && typeof object === "object"; };
exports.isStr = (string) => { return typeof string === "string"; };
exports.log = (msg) => { console.log(msg); };
// #endregion