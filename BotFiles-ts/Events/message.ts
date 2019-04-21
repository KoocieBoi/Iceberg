import { Client, Message } from "discord.js"
import { readdir } from  "fs"
import { log } from "../Util/logger"

export function run(client: Client, message: Message) {
   readdir("./BotFiles-js/Commands", (err, files) => {
      if (err) log.error(err)
      
      files.forEach(command => {
         if (!command.endsWith(".js")) return log.warning(`Found file in commands folder that is not a JS file! (${command})`)
         
         const cmdClass = require(`../Commands/${command}`).default
         const cmd = new cmdClass()
         
         cmd.check(message)
         if (cmd.check(message)) cmd.run(client, message, cmd.arguments, cmd.cmd)
      })
   })
}