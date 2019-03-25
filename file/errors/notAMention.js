import { ErrorClass } from "./main"
import { RichEmbed } from "discord.js"

class NotAMention extends ErrorClass(RichEmbed) {
   constructor () {
      super("This is not a valid mention!")
   }
}

const notAMention = new NotAMention()

export { notAMention }
