import low from "lowdb";
import hastebin from "hastebin.js";
import config from "../../.data/config";
import { RichEmbed } from "discord.js";

let haste = new hastebin({ dev: true });
let FileSync = require("lowdb/adapters/FileSync");
let commandsDBAdapter = new FileSync("./.data/db/commands.json");
let commandsDB = low(commandsDBAdapter);

commandsDB.defaults({ commands: [], categories: [] }).write();

const categories = commandsDB.get("categories").value();
const commandsInCategory = (category) => {
   return commandsDB.get("commands").filter({category: category}).value();
};
const amountCommandsInCategory = (category) => {
   return commandsInCategory(category).length;
};
function getCommandById(id) {
   let command = commandsDB.get("commands")
      .filter({ id: id })
      .value();
   
   if (command[0] !== undefined) return command[0];
   else return false;
}

let embeds = {
   hastebinDB: (msg, link) => {
      let embed = new RichEmbed()
         .setColor("#36393F")
         .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL)
         .setTimestamp()
         .setDescription(`Output from the database:\n${link}`);
      return embed;
   },
   commandDoesNotExist: () => {
      return new RichEmbed()
         .setColor("#36393F")
         .setDescription("There is no command with that id.");
   },
   helpCategoryList: () => {
      let embed = new RichEmbed()
         .setColor("#36393F")
         .setTimestamp()
         .setFooter("ib$help category <category> to see the commands in that category")
         .setTitle("Commands categories");

      categories.forEach((categ, index) => {
         embed.addField(`\`${index}.\` ${categ}`, `\`${amountCommandsInCategory(index)} ${(amountCommandsInCategory(index) === 1) ? "command" : "commands"}\``, true);
      });

      return embed;
   },
   categoryDoesNotExist: () => {
      return new RichEmbed()
         .setColor("#39393F")
         .setTimestamp()
         .setFooter("The category does not exist!");
   },
   helpCommandsInCategory: (args) => {
      function returnCommandString(command) {
         return `**${command.name}:** \`${command.id}\` - ${command.description}`; 
      }
      let allCommands = "";
      commandsInCategory(Number(args[1])).forEach((command) => {
         allCommands += returnCommandString(command);
      });

      return new RichEmbed()
         .setColor("#36393F")
         .setTitle(categories[Number(args[1])])
         .setDescription(allCommands)
         .setTimestamp();
   },
   helpSpecificCommand: (args) => {
      let command = getCommandById(args[1]);
      let embed = new RichEmbed()
         .setColor("#36393F")
         .setTitle(command.name)
         .setDescription(command.description);

      command.usage.forEach((usage) => {
         embed.addField(usage.description, `\`${usage.usage}\`\n\`${usage.example}\`\n\n`, true);
      });

      return embed;
   }
};


function exec (client, msg, cmd, args) {
   if (cmd === "help") {
      if (msg.author.id === config.ownerID) {
         if (args[0] && args[0].toLowerCase() === "dbcommands") {
            let formattedDB = JSON.stringify(commandsDB.value(), null, 3);
            haste.post(formattedDB).then((link) => {
               msg.channel.send({ embed: embeds.hastebinDB(msg, link)});
            });
         }
      }
      if (args[0] === undefined) {
         msg.channel.send({ embed: embeds.helpCategoryList() });
      }
      else if (args[0] && args[1]) {
         if (args[0].toLowerCase() === "category") {
            if (Number(args[1]) >= 0 && Number(args[1]) < categories.length) {
               msg.channel.send({ embed: embeds.helpCommandsInCategory(args) });
            }
            else msg.channel.send({ embed: embeds.categoryDoesNotExist()});
         }
         else if (args[0].toLowerCase() === "command") {
            if (getCommandById(args[1])) msg.channel.send({ embed: embeds.helpSpecificCommand(args) });
            else msg.channel.send({ embed: embeds.commandDoesNotExist() });
         }
      }
   }
}

export { exec };