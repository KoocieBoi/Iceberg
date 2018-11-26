import cfg from "../../.data/config";
import fs from "fs";
import { log } from "../utils/main";
const t = new Date();

function eventExec () {
   const timeFormat = `${t.getHours()}H:${t.getMinutes()}m (${t.getDay()}D ${t.getMonth() + 1}M)`;
   log(`Iceberg bot (${cfg.bot.id})\n+=+==========+=+\n${timeFormat}\n+=+==========+=+`);

   fs.readdir("./file/commands/", (err, files) => {
      if (err) { log(err); return; }
      if (files.length <= 0) { log("No commands!"); return; }
      log("Commands found:");
      files.forEach((file, i) => log(`   - (${i + 1}) ${file}`));
   });
}

export default eventExec;