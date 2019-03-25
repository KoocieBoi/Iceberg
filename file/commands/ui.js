import { isMention } from "../utils/main"
import { notAMention } from "../errors/notAMention"
import { userInfo } from "../messages/userInfo"

const exec = (client, msg, cmd, args) => {
   if (args[0] && !args[1]) {
      const mention = isMention(msg, args[0])

      if (mention) {
         return msg.channel.send({
            embed: userInfo(mention.user, mention)
         })
      }
      return msg.channel.send({
         embed: notAMention
      })
   }
   return msg.channel.send({
      embed: userInfo(msg.author, msg.member)
   })
}

const settings = {
   aliases: [
      "ui",
      "userinfo",
      "whatabout"
   ]
}
export { exec, settings }
