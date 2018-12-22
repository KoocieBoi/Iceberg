import cfg from "../../.data/config";
import fs from "fs";
import { log } from "../utils/main";

function eventExec (msg, client) {
   if (msg.author.bot || msg.channel.type !== "text") return;
   let args, cmd, pfx = {
      letter: cfg.bot.letterPrefix,
      mention: cfg.bot.mentionPrefix
   };
   if (!msg.content.startsWith(pfx.letter) && !msg.content.startsWith(pfx.mention)) return;


   let sliceLength = msg.content.startsWith(pfx.letter)
      ? pfx.letter.length
      : (msg.content.startsWith(pfx.mention)
         ? pfx.mention.length : undefined);

   args = msg.content.slice(sliceLength).trim().split(" ");
   cmd = args.shift().toLowerCase();

   fs.readdir("./file/commands", (err, files) => {
      if (err) { log(err); return; }
      if (files.length <= 0) return;

      files.forEach((file) => {
         let command = require(`../commands/${file}`);
         command.exec(client, msg, cmd, args);
      });
   });
}

export default eventExec;