import { Client, Message } from "discord.js"
import { CommandsMap } from "./ready"

const config = require("../../Data/config.json")
const botInfo = config.bot

export function run(client: Client, message: Message) {

   // ❤️ https://gist.github.com/Anish-Shobith/10cfa62b2defd396d87ff4c50be897f8
   const prefixRegExp = new RegExp(`^(<@!?${botInfo.id}>|\\${botInfo.prefix})\\s*`)
   if (!prefixRegExp.test(message.content)) return
   
   const testPrefix = prefixRegExp.exec(message.content)[0]
   let args = message.content
      .replace(testPrefix, "")
      .trim()
      .split(" ")
   const command = args[0]
   args.splice(0, 1)

   CommandsMap.forEach((cmdObject, aliases) => {
      if (aliases.indexOf(command) !== -1) {
         cmdObject.check(message)
         if (cmdObject.check(message)) {
            cmdObject.run(message.client, message, args, command)
         }
      }
   })
}