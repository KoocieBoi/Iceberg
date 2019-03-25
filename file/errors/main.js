import ct from "../utils/constants"

const ErrorClass = Class => class extends Class {
   constructor (errorMessage, data) {
      super(data)
      this.setColor(ct.EMBED.ERROR_COLOR)
         .setDescription(`\`ERR:\` ${errorMessage}`)
   }
}

export { ErrorClass }
