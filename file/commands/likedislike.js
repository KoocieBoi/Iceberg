import { RichEmbed } from "discord.js";
import { isMention } from "../utils/main";
import low from "lowdb";
import moment from "moment";

const FileSync = require("lowdb/adapters/FileSync");

const likeDBAdapter = new FileSync("./.data/db/likedislike.json");
const likeDB = low(likeDBAdapter);

const embeds = {
   alreadyGaveThat (timestamp) {
      return new RichEmbed()
         .setColor("#36393F")
         .setFooter("You already gave that user a like or dislike.")
         .setTimestamp(timestamp);
   },
   gaveAppr (cmd, mention, user) {
      return new RichEmbed()
         .setColor("#36393F")
         .setDescription(`You gave a \`${cmd}\` to ${mention}`)
         .setTimestamp()
         .setFooter(`${user.likes} likes / ${user.dislikes} dislikes`, mention.user.avatarURL);
   },
   notAMention () {
      return new RichEmbed()
         .setColor("#36393F")
         .setFooter("That is not a valid mention!");
   }
};

likeDB.defaults({ "likedislike": [] }).write();

const exec = (client, msg, cmd, args) => {
   
   if (cmd !== "like" && cmd !== "dislike") {
      return;
   }
   if (args[1]) {
      return;
   }

   const mention = isMention(msg, args[0]);

   if (mention.user.id === msg.author.id) {
      msg.react("526061956952489984");
      return;
   }

   if (mention) {
      const userInDB = likeDB
         .get("likedislike")
         .filter({ "id": mention.user.id });
      const mentionUser = userInDB.value();

      if (mentionUser[0]) {
         const indexUser = likeDB
            .get("likedislike")
            .value()
            .indexOf(mentionUser[0]);
         const appreciations = likeDB
            .get(`likedislike[${indexUser}].appreciations`)
            .filter({ "from": msg.author.id });

         /*
          * !!!
          * const indexAppr = likeDB
          *    .get(`likedislike[${indexUser}].appreciations`)
          *    .value()
          *    .indexOf(appreciations.value()[0]);
          */


         if (appreciations.value()[0]) {
            const dateDB = appreciations.value()[0].onDate;

            msg.channel.send({ "embed": embeds.alreadyGaveThat(moment(dateDB).toDate()) });
         } else {
            likeDB.get(`likedislike[${indexUser}].appreciations`)
               .push({
                  "from": msg.author.id,
                  "type": cmd,
                  "onDate": moment().format("YYYYMMDDThhmm")
               })
               .write();

            const { likes, dislikes } = mentionUser[0];

            if (cmd === "like") {
               likeDB.get(`likedislike[${indexUser}]`)
                  .assign({
                     "likes": likes + 1
                  })
                  .write();
            } else {
               likeDB.get(`likedislike[${indexUser}]`)
                  .assign({
                     "dislikes": dislikes + 1
                  })
                  .write();
            }
            msg.channel.send({
               "embed": embeds.gaveAppr(cmd, mention, userInDB.value()[0])
            });
         }
      } else {
         let noUserDislikes = 0,
            noUserLikes = 0;

         if (cmd === "like") {
            noUserLikes = 1;
         } else {
            noUserDislikes = 1;
         }

         likeDB.get("likedislike")
            .push({
               "id": mention.user.id,
               "likes": noUserLikes,
               "dislikes": noUserDislikes,
               "appreciations": [
                  {
                     "from": msg.author.id,
                     "type": cmd,
                     "onDate": moment().format("YYYYMMDDThhmm")
                  }
               ]
            })
            .write();

         msg.channel.send({
            "embed": embeds.gaveAppr(cmd, mention, userInDB.value()[0])
         });
      }
   } else {
      msg.channel.send({ "embed": embeds.notAMention() });
   }
};

export { exec };
