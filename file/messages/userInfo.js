import { MainEmbed } from "./main"
import { RichEmbed } from "discord.js";
import moment from "moment"
import { stripIndent } from "common-tags"

class UserInfo extends MainEmbed(RichEmbed) {
   constructor (user, member) {
      super()
      const
         avatar = user.avatarURL,
         discrim = user.discriminator,
         hasAdmin = member.permissions.has("ADMINISTRATOR"),
         hasBan = member.permissions.has("BAN_MEMBERS"),
         hasDeafen = member.permissions.has("DEAFEN_MEMBERS"),
         hasEveryone = member.permissions.has("MENTION_EVERYONE"),
         hasKick = member.permissions.has("KICK_MEMBERS"),
         hasMute = member.permissions.has("MUTE_MEMBERS"),
         highestRole = member.highestRole.name,
         { id } = user,
         joinedD = moment().diff(moment(user.createdAt), "weeks"),
         joinedG = moment().diff(moment(member.guild.joinedAt), "weeks"),
         name = user.username,
         nick = member.displayName

      let { status, game } = user.presence

      if (status === "online") {
         status = "Online"
      }
      else if (status === "offline") {
         status = "Offline / Invisible"
      }
      else if (status === "idle") {
         status = "AFK"
      }
      else if (status === "dnd") {
         status = "Do not disturb"
      }

      if (game) {
         game = user.presence.game.name
      }
      else {
         game = "None"
      }

      const generalInfo = stripIndent`
            • **Username:** ${name}
            • **Discriminator:** ${discrim}
            • **ID:** ${id}
            • **Avatar:** [click](${avatar})
            • **Joined Discord:** ${joinedD}w ago
            • **Status:** ${status}
            • **Playing:** ${game}
         `,
         guildInfo = stripIndent`
            • **Nick:** ${nick}
            • **Joined guild:** ${joinedG}w ago
            • **Highest role:** ${highestRole}
            • **Permissions:**
            \`\`\`diff
            ${hasAdmin ? "+" : "-"} Admin
            ${hasBan ? "+" : "-"} Ban
            ${hasKick ? "+" : "-"} Kick
            ${hasEveryone ? "+" : "-"} Everyone
            ${hasMute ? "+" : "-"} Mute
            ${hasDeafen ? "+" : "-"} Deafen
            \`\`\`
         `

      this.setAuthor(`${name}#${discrim}`, avatar)
         .setThumbnail(avatar)
         .addField("General Info", generalInfo, true)
         .addField("Guild", guildInfo, true)
   }
}

const userInfo = (user, member) => new UserInfo(user, member)

export { userInfo }
