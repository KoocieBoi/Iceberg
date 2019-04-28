import { Message, Client, PermissionString, RichEmbed } from "discord.js"
import databases from "./databases"
import moment from "moment"
import { WARNING_COLOR_EMBED, ERROR_COLOR_EMBED } from "../Util/constants"
import { log } from "./logger";
const config = require("../../Data/config.json")

const { ownerID, bot } = config

export abstract class Command {
   public commandOptions: CommandOptionsInterface

   constructor(commandOptions: CommandOptionsInterface) {
      this.commandOptions = commandOptions
   }

   get options() { return this.commandOptions }

   public check(message: Message) : boolean {
      const options = this.options
      const messages = {
         onlyForBotOwner: new RichEmbed()
            .setColor(ERROR_COLOR_EMBED)
            .setFooter("This command is available only to the owner of the bot."),
         notEnoughPermissions(id: string, permissionsArray: PermissionString[]) {
            let permissionString = ""
            const member = message.guild.member(id)

            permissionsArray.forEach(permission => {
               permissionString += `\`${permission}\` `
            })

            return new RichEmbed()
               .setColor(ERROR_COLOR_EMBED)
               .setDescription(`${member} needs the following permissions to execute this command: ${permissionString}`)
         },
         commandOnCooldown(remainingCooldown: string) {
            return new RichEmbed()
               .setColor(WARNING_COLOR_EMBED)
               .setFooter(`This command will be available ${remainingCooldown}`)
         }
      }

      if (options.ownerOnly && message.author.id !== ownerID) {
         message.channel.send({
            embed: messages.onlyForBotOwner
         })
            .then((sentMessage) => log.info("Successfully sent onlyForBotOwner error message!"))
            .catch((error) => log.error(`There was an error while sending onlyForBotOwner error.\n${error}`))

         return false
      }

      if (options.cooldown) {
         const commandName = options.name
         const authorID = message.author.id

         const cooldownAuthor = databases.cooldowns.get(authorID)[commandName]

         if (cooldownAuthor) {

            const cooldown = {
               amount: options.cooldown.amount,
               unit: options.cooldown.unit
            }

            const commandAvailable =  moment(cooldownAuthor).add(cooldown.amount, cooldown.unit)
            const now = moment()

            if (commandAvailable > moment()) {
               const remainingCooldown = moment
                  .duration(commandAvailable.diff(now))
                  .humanize(true)

               // extract msg
               message.channel.send({
                  embed: messages.commandOnCooldown(remainingCooldown)
               })
                  .then((sentMessage) => log.info("Successfully sent commandOnCooldown error message!"))
                  .catch((error) => log.error(`There was an error while sending commandOnCooldown error.\n${error}`))
               return false
            }
         }
      }

      if (options.permissions) {
         if (options.permissions.bot) {
            const botMember = message.guild.member(bot.id)
            const botPermissions = botMember.permissions

            if (!botPermissions.has(options.permissions.bot, true)) {
               message.channel.send({
                  embed: messages.notEnoughPermissions(bot.id, botPermissions.toArray())
               })
                  .then((sentMessage) => log.info("Successfully sent notEnoughPermissions error message!"))
                  .catch((error) => log.error(`There was an error while sending notEnoughPermissions error.\n${error}`))
               return false
            }
         }
         if (options.permissions.member) {
            const memberPermissions = message.member.permissions

            if (!memberPermissions.has(options.permissions.member, true)) {
               message.channel.send({
                  embed: messages.notEnoughPermissions(message.author.id, memberPermissions.toArray())
               })
                  .then((sentMessage) => log.info("Successfully sent notEnoughPermissions error message!"))
                  .catch((error) => log.error(`There was an error while sending notEnoughPermissions error.\n${error}`))
               return false
            }
         }
      }

      return true;
   }

   public abstract run(client: Client, message: Message, commandArguments: string[], command: string): void
}

export function setCooldown(commandName: string, authorId: string) : void {
   let toPush = {}
   toPush[commandName] = moment().format()

   databases.cooldowns.set(authorId, toPush)
}

interface CommandOptionsInterface {
   name: string,
   category: string,
   description: string,
   aliases: string[],
   ownerOnly: boolean,
   usages: Array <{
      description: string,
      example: string
   }>
   cooldown?: {
      amount: number,
      unit: moment.unitOfTime.DurationConstructor
   },
   permissions?: {
      bot?: PermissionString[],
      member?: PermissionString[]
   }
}
