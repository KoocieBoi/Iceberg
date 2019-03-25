import { ErrorClass } from "./main"
import { RichEmbed } from "discord.js"

class NotEnoughPermissions extends ErrorClass(RichEmbed) {
   constructor (member, permissions) {
      let permissionsString = ""

      permissions.forEach(perm => {
         permissionsString += `\`${perm}\` `
      })
      super(`${member} needs the following permissions for the command to be run: ${permissionsString}.`)
   }
}

const notEnoughPermissions = (member, permissions) => new NotEnoughPermissions(member, permissions)

export { notEnoughPermissions }
