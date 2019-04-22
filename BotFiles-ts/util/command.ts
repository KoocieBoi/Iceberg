import { Message, Client } from "discord.js"

const config = require("../../Data/config.json")
const { ownerID } = config

export abstract class Command {
   public commandOptions: commandOptionsInterface
   constructor (commandOptions: commandOptionsInterface) {
      this.commandOptions = commandOptions
   }
   
   get options() { return this.commandOptions }

   check(message: Message) : boolean {
      if (this.options.ownerOnly && message.author.id !== ownerID) return false // and msg owneronly error
      
      return true;
   } 

   abstract run(client: Client, message: Message, commandArguments: string[], command: string): void
}

interface commandOptionsInterface {
   aliases: string[],
   ownerOnly: boolean
}