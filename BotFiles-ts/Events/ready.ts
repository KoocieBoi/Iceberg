import { Client } from "discord.js"
import { readdir } from "fs"
import { log } from "../Util/logger"

const CommandsMap = new Map()

export { CommandsMap }

export function run(client: Client) {
   readdir("./BotFiles-js/Commands", (err, files) => {
      if (err) {
         return log.error(`Error while retrieving files from the commands folder to handle them.\n${err}`)
      }
      files.forEach(cmd => {
         if (!cmd.endsWith(".js")) return log.warning(`Found file in commands folder that is not a JS file! (${cmd})`)

         const commandClass = require(`../Commands/${cmd}`).default
         const command = new commandClass()

         CommandsMap.set(command.commandOptions.aliases, {
            options : command.commandOptions,
            run: command.run,
            check: command.check
         })
         log.info(`Loaded command "${cmd}" into the Map!`)
      })
   })
}
