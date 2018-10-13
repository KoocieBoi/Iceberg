let config = require("./.data/config");
let utils = require("./file/utils/main");
let { on, login } = utils;
let Discord = require("discord.js");

let events = {
   ready: require("./file/events/ready")
};

login(config.credentials.token);
on("ready", () => { events.ready(); });
