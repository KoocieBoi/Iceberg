import { alreadyGaveUserAppreciation } from "../errors/alreadyGaveUserAppreciation"
import { gaveAppreciation } from "../messages/GaveAppreciation"
import { isMention } from "../utils/main"
import low from "lowdb"
import moment from "moment"
import { notAMention } from "../errors/notAMention"

const FileSync = require("lowdb/adapters/FileSync")

const likeDBAdapter = new FileSync("./.data/db/likedislike.json")
const likeDB = low(likeDBAdapter)

likeDB.defaults({ likedislike: [] }).write()

const exec = (client, msg, cmd, args) => {
   if (args[1]) {
      return
   }

   const mention = isMention(msg, args[0])

   if (mention.user.id === msg.author.id) {
      return msg.react("526061956952489984")
   }

   if (mention) {
      const userInDB = likeDB
         .get("likedislike")
         .filter({ id: mention.user.id })
      const mentionUser = userInDB.value()

      if (mentionUser[0]) {
         const indexUser = likeDB.get("likedislike").value().indexOf(mentionUser[0])
         const appreciations = likeDB
            .get(`likedislike[${indexUser}].appreciations`)
            .filter({ from: msg.author.id })

         if (appreciations.value()[0]) {
            const dateDB = appreciations.value()[0].onDate
            const formattedDate = moment(dateDB).toDate()

            msg.channel.send({ embed: alreadyGaveUserAppreciation(formattedDate) })
         }
         else {
            likeDB.get(`likedislike[${indexUser}].appreciations`)
               .push({
                  from: msg.author.id,
                  type: cmd,
                  onDate: moment().format("YYYYMMDDThhmm")
               })
               .write()

            const { likes, dislikes } = mentionUser[0]
            const apprAssign = cmd === "like" ? { likes: likes + 1 } : { dislikes: dislikes + 1 }

            likeDB.get(`likedislike[${indexUser}]`)
               .assign(apprAssign)
               .write()

            msg.channel.send({
               embed: gaveAppreciation(cmd, mention, userInDB.value()[0])
            })
         }
      }
      else {
         likeDB.get("likedislike")
            .push({
               id: mention.user.id,
               likes: cmd === "like" ? 1 : 0,
               dislikes: cmd === "like" ? 0 : 1,
               appreciations: [
                  {
                     from: msg.author.id,
                     type: cmd,
                     onDate: moment().format("YYYYMMDDThhmm")
                  }
               ]
            })
            .write()

         msg.channel.send({
            embed: gaveAppreciation(cmd, mention, userInDB.value()[0])
         })
      }
   }
   else {
      msg.channel.send({ embed: notAMention })
   }
}

const settings = {
   aliases: [ "like", "dislike" ]
}

export { exec, settings }
