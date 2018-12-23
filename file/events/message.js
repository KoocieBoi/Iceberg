import cfg from "../../.data/config";
import fs from "fs";
import { log } from "../utils/main";

const eventExec = (msg, client) => {
   const pfx = {
      "letter": cfg.bot.letterPrefix,
      "mention": cfg.bot.mentionPrefix
   };

   if (msg.author.bot || msg.channel.type !== "text") {
      return;
   }
   if (!msg.content.startsWith(pfx.letter) && !msg.content.startsWith(pfx.mention)) {
      return;
   }

   let sliceLength;

   if (msg.content.startsWith(pfx.letter)) {
      sliceLength = pfx.letter.length;
   } else if (msg.content.startsWith(pfx.mention)) {
      sliceLength = pfx.mention.length;
   }

   const args = msg.content
      .slice(sliceLength)
      .trim()
      .split(" ");
   const cmd = args
      .shift()
      .toLowerCase();

   fs.readdir("./file/commands", (err, files) => {
      if (err) {
         log(err);
         return;
      }
      if (files.length <= 0) {
         return;
      }

      files.forEach((file) => {
         const command = require(`../commands/${file}`);

         command.exec(client, msg, cmd, args);
      });
   });
};

export default eventExec;
