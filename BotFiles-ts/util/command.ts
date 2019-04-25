import { Message, Client } from "discord.js"
import databases from "./databases"
import moment from "moment"
import { ownerID } from "../../Data/config.json"

export abstract class Command {
   public commandOptions: CommandOptionsInterface

   constructor(commandOptions: CommandOptionsInterface) {
      this.commandOptions = commandOptions
   }

   get options() { return this.commandOptions }

   public check(message: Message) : boolean {
      const options = this.options

      if (options.ownerOnly && message.author.id !== ownerID) return false // and msg owneronly error

      if (options.cooldown) {
         const commandName = options.name
         const authorID = message.author.id

         const cooldownAuthor = databases.cooldowns.get(authorID)[commandName]

         if (cooldownAuthor) {

            const cooldown = {
               amount: options.cooldown.amount,
               unit: options.cooldown.unit
            }

            const commandAvailable =  moment(cooldownAuthor).add(cooldown.unit, cooldown.amount)
            const now = moment()

            if (commandAvailable > moment()) {
               const remainingCooldown = moment
                  .duration(commandAvailable.diff(now))
                  .humanize(true)
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
   aliases: string[],
   cooldown?: {
      amount: number,
      unit: moment.unitOfTime.DurationConstructor
   }
   ownerOnly: boolean
}
