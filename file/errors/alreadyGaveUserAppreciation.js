import { ErrorClass } from "./main"
import { RichEmbed } from "discord.js"

class AlreadyGaveUserAppreciation extends ErrorClass(RichEmbed) {
   constructor (time) {
      super("You already gave that user a like / dislike")
      this.setTimestamp(time)
   }
}

const alreadyGaveUserAppreciation = time => new AlreadyGaveUserAppreciation(time)

export { alreadyGaveUserAppreciation }
