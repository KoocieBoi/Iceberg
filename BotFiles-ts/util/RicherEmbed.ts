import { RichEmbed } from "discord.js"
import {
   TRANSPARENT_COLOR_EMBED,
   ERROR_COLOR_EMBED,
   SUCCESS_COLOR_EMBED,
   WARNING_COLOR_EMBED
} from "./constants"
import { log } from "./logger";

export class RicherEmbed extends RichEmbed {
   public embedName : string

   constructor(embedName?, embedObject?) {
      super(embedObject)
   }

   public setTransparentColor() {
      this.setColor(TRANSPARENT_COLOR_EMBED)
      return this
   }
   public setSuccessColor() {
      this.setColor(SUCCESS_COLOR_EMBED)
      return this
   }
   public setWarningColor() {
      this.setColor(WARNING_COLOR_EMBED)
      return this
   }
   public setErrorColor() {
      this.setColor(ERROR_COLOR_EMBED)
      return this
   }

   public emptyFields() {
      this.fields = []
      return this
   }

   public clearField(index) {
      if (this.fields[index]) this.fields.splice(index, 1)
      else return log.error(`The field with the index ${index} in the ${this.embedName} embed does not exist!`)

      return this
   }

   public getEmbedData() {
      const hexColor = this.color.toString(16)
      const colorTransparent = hexColor === TRANSPARENT_COLOR_EMBED ? "transparent" : false
      const colorSuccess = hexColor === SUCCESS_COLOR_EMBED ? "success" : false
      const colorWarning =  hexColor === WARNING_COLOR_EMBED ? "warning" : false
      const colorError = hexColor === ERROR_COLOR_EMBED ? "error" : false
      const colorType = colorTransparent || colorSuccess || colorWarning || colorError || "other"

      const { embedName } = this
      const richEmbed = new RichEmbed(this)

      return {
         richer: {
            name: embedName,
            type: colorType
         },
         rich: richEmbed
      }
   }

}
