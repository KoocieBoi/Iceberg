let config = require("./.data/config");
let utils = require("./file/utils/main");
let { on, login } = utils;
let Discord = require("discord.js");

login(config.credentials.token);
on("ready", () => { console.log("ready"); });

