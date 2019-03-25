import ct from "../utils/constants"

const MainEmbed = Class => class extends Class {
   constructor (data) {
      super(data)
      this.setColor(ct.EMBED.TRANSPARENT_COLOR)
         .setTimestamp()
   }
}

export { MainEmbed }
