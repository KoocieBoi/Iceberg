import cfg from "../../.data/config";
import fs from "fs";
import { log } from "../utils/main";
const time = new Date();

const eventExec = () => {
   const timeFormat = `${time.getHours()}H:${time.getMinutes()}m (${time.getDay()}D ${time.getMonth() + 1}M)`;

   log(`Iceberg bot (${cfg.bot.id})\n+=+==========+=+\n${timeFormat}\n+=+==========+=+`);

   fs.readdir("./file/commands/", (err, files) => {
      if (err) {
         log(err);
         return;
      }
      if (files.length <= 0) {
         log("No commands!");
         return;
      }
      log("Commands found:");
      files.forEach((file, index) => {
         log(`   - (${index + 1}) ${file}`);
      });
   });
};

export default eventExec;
