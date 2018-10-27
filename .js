// #region Dependencies
let config = require("./.data/config");
let utils = require("./file/utils/main");
let { on, login } = utils;
let Discord = require("discord.js");

let events = {
   ready: require("./file/events/ready"),
   message: require("./file/events/message")
};
// #endregion

login(config.credentials.token);
on("ready", () => events.ready());
on("message", (msg, client) => events.message(msg, client))
