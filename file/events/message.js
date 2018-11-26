import cfg from "../../.data/config";
import fs from "fs";
import { log } from "../utils/main";

function eventExec (msg, client) {
   if (msg.author.bot || msg.channel.type !== "text") return;

   let args, cmd, pfx = {
      letter: cfg.bot.letterPrefix,
      mention: cfg.bot.mentionPrefix
   };

   if (msg.content.startsWith(pfx.letter)) {
      args = msg.content.slice(pfx.letter.length).trim().split(" ");
      cmd = args.shift().toLowerCase();
   }
   if (msg.content.startsWith(pfx.mention)) {
      args = msg.content.slice(pfx.mention.length).trim().split(" ");
      cmd = args.shift().toLowerCase();
   }

   fs.readdir("./file/commands", (err, files) => {
      if (err) { log(err); return; }
      if (files.length <= 0) return;

      files.forEach((file) => {
         let command = require(`../commands/${file}`);
         command(client, msg, cmd, args);
      });
   });
}

export default eventExec;