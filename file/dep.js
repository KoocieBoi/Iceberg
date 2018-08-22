let Discord = require("discord.js");
let Client = new Discord.Client();

module.exports = {
  login: (token) => Client.login(token),
  on: (event, listenerFunction) => Client.on(event, listenerFunction)
}
