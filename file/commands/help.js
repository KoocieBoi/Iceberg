import { RichEmbed } from "discord.js"
import low from "lowdb"

const FileSync = require("lowdb/adapters/FileSync")
const cmdDBAdapter = new FileSync("./.data/db/commands.json")
const cmdDB = low(cmdDBAdapter)

cmdDB.defaults({
   commands: [],
   categories: []
})
   .write()

const categories = cmdDB.get("categories").value()
const commandsInCategory = category => cmdDB
   .get("commands")
   .filter({ category })
   .value()
const amountCommandsInCategory = category => commandsInCategory(category).length
const getCommandById = id => {
   const command = cmdDB
      .get("commands")
      .filter({ id })
      .value()

   return command[0] || false
}

const embeds = {
   commandDoesNotExist () {
      return new RichEmbed()
         .setColor("#36393F")
         .setDescription("There is no command with that id.")
   },
   helpCategoryList () {
      const embed = new RichEmbed()
         .setColor("#36393F")
         .setTimestamp()
         .setFooter("ib$help category <category> to see the commands in that category")
         .setTitle("Commands categories")

      categories.forEach((categ, index) => {
         embed.addField(`\`${index}.\` ${categ}`, `\`${amountCommandsInCategory(index)} commands\``, true)
      })

      return embed
   },
   categoryDoesNotExist () {
      return new RichEmbed()
         .setColor("#39393F")
         .setTimestamp()
         .setFooter("The category does not exist!")
   },
   helpCommandsInCategory (args) {
      const returnCommandString = command => {
         const { name, id, description } = command

         return `**${name}:** \`${id}\` - ${description}\n`
      }
      let allCommands = ""

      commandsInCategory(Number(args[1])).forEach(command => {
         allCommands += returnCommandString(command)
      })

      return new RichEmbed()
         .setColor("#36393F")
         .setTitle(categories[Number(args[1])])
         .setDescription(allCommands)
         .setTimestamp()
   },
   helpSpecificCommand (args) {
      const command = getCommandById(args[1])
      const embed = new RichEmbed()
         .setColor("#36393F")
         .setTitle(command.name)

      command.usage.forEach(examples => {
         const { description, usage, example } = examples

         embed.addField(description, `\`${usage}\`\n\`${example}\`\n`, true)
      })

      let aliases = "Aliases: "

      command.aliases.forEach(alias => {
         aliases += ` \`${alias}\``
      })
      embed.setDescription(`${command.description}\n\n${aliases}`)

      return embed
   }
}


const exec = (client, msg, cmd, args) => {
   if (!args[0]) {
      msg.channel.send({ embed: embeds.helpCategoryList() })
   }
   else if (args[0] && args[1]) {
      if (args[0].toLowerCase() === "category") {
         if (Number(args[1]) >= 0 && Number(args[1]) < categories.length) {
            msg.channel.send({ embed: embeds.helpCommandsInCategory(args) })
         }
         else {
            msg.channel.send({ embed: embeds.categoryDoesNotExist() })
         }
      }
      else if (args[0].toLowerCase() === "command") {
         if (getCommandById(args[1])) {
            msg.channel.send({ embed: embeds.helpSpecificCommand(args) })
         }
         else {
            msg.channel.send({ embed: embeds.commandDoesNotExist() })
         }
      }
   }
}

const settings = {
   aliases: [ "help" ]
}

export { exec, settings }
