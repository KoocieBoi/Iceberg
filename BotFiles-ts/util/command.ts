import { Message, Client } from "discord.js";

const config = require("../../Data/config.json")
const { ownerID } = config
const botInfo = config.bot

export abstract class Command {
   public commandOptions: commandOptionsInterface
   public args: string[]
   public command: string
   constructor (commandOptions: commandOptionsInterface) {
      this.commandOptions = commandOptions
   }
   
   get options() { return this.commandOptions }
   get cmd() { return this.command }
   get arguments() { return this.args }

   check(message: Message) : boolean {
      // ❤️ https://gist.github.com/Anish-Shobith/10cfa62b2defd396d87ff4c50be897f8
      const prefixRegExp = new RegExp(`^(<@!?${botInfo.id}>|\\${botInfo.prefix})\\s*`)

      if (!prefixRegExp.test(message.content)) return false
      
      const testPrefix = prefixRegExp.exec(message.content)[0]
      this.args = message.content
         .replace(testPrefix, "")
         .trim()
         .split(" ")
      this.command = this.args[0]
      this.args.splice(0, 1)

      if (this.commandOptions.aliases.indexOf(this.command) === -1) return false
      if (this.commandOptions.ownerOnly && message.author.id !== ownerID) return false // and msg owneronly error
      
      return true;
   } 

   abstract run(client: Client, message: Message, args: string[], command: string): void
}

interface commandOptionsInterface {
   aliases: string[],
   ownerOnly: boolean
}