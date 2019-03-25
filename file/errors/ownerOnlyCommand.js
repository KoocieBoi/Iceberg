import { ErrorClass } from "./main"
import { RichEmbed } from "discord.js"

class OwnerOnlyCommand extends ErrorClass {
   constructor () {
      super("You need to be the owner of this bot to run this command.")
   }
}

export { OwnerOnlyCommand }
