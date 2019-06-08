import { Command, categories } from "../Util/command"
import { Client, Message, RichEmbed } from "discord.js";
import { CommandsMap } from "../Events/ready"
import { SUCCESS_COLOR_EMBED } from "../Util/constants"
import { log } from "../Util/logger"
import { stripIndents } from "common-tags"

export default class extends Command {
   constructor() {
      super({
         name: "help",
         description: "A command that helps you with all the things this bot can do.",
         category: "misc",
         aliases: ["help", "halp"],
         usages: [
            {
               description: "Shows a list of the available categories and their commands",
               example: "help"
            },
            {
               description: "Shows help about a specific command such as aliases and examples",
               example: "help <command>"
            }
         ],
         cooldown: {
            amount: 10,
            unit: "s"
         },
         ownerOnly: false
      })
   }

   public run(client: Client, message: Message, args: string[], command: string) {

      const messages = {
         helpNoArgsResponse: new RichEmbed()
            .setColor(SUCCESS_COLOR_EMBED)
            .setTitle("Bot commands")
            .setFooter("help <command> for detailed use"),
         helpSpecificCommandResponse: new RichEmbed()
            .setColor(SUCCESS_COLOR_EMBED)

      }

      if (!args[0]) {
         categories.forEach((category) => {
            let commandString = ""
            CommandsMap.forEach((mappedCommand, aliases) => {
               if (category.id === mappedCommand.options.category) commandString += `\`${mappedCommand.options.name}\` `
            })
            messages.helpNoArgsResponse.addField(category.name, commandString)
         })
         message.channel.send({ embed: messages.helpNoArgsResponse })
            .then(sentMessage => log.info("Successfully sent helpNoArgs response!"))
            .catch(error => log.error(error))
      }
      if (args[0]) {
         CommandsMap.forEach((commandOptions, aliases: string[]) => {
            if (aliases.indexOf(args[0]) !== -1) {
               // finish embed
               const commandName = commandOptions.options.name
               let aliasesString = ""
               const { usages } = commandOptions.options
               let usagesString = ""
               const { description } = commandOptions.options
               const { category } = commandOptions.options

               aliases.forEach(alias => aliasesString += `\`${alias}\` `)
               usages.forEach(usage => usagesString += `> ${usage.description}\n# ${usage.example}\n\n`)
               usagesString =  "```md\n" + usagesString + "```"

               messages.helpSpecificCommandResponse
                  .addField("Basic info", stripIndents`
                     **Name:** \`${commandName}\`
                     **Category:** \`${category}\`
                     **Description:** \`${description}\`
                     **Aliases:** ${aliasesString}
                  `, true)
                  .addField("Usages", usagesString, true)

               message.channel.send({ embed: messages.helpSpecificCommandResponse })
                  .then(sentMessage => log.info("Successfully sent helpSpecificCommand response!"))
                  .catch(error => log.error(error))
            }
         })
      }
   }
}
