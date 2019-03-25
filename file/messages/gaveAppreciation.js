import { MainEmbed } from "./main"
import { RichEmbed } from "discord.js"

class GaveAppreciation extends MainEmbed(RichEmbed) {
   constructor (command, mention, user) {
      super()
      const { likes, dislikes } = user
      this.setDescription(`You gave a \`${command}\` to ${mention}`)
         .setFooter(`${likes} likes / ${dislikes} dislikes`, mention.user.avatarURL)
   }
}

const gaveAppreciation = (command, mention, user) => new GaveAppreciation(command, mention, user)

export { gaveAppreciation }
