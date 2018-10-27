const cfg = require("../../.data/config");
const fs = require("fs");
const t = new Date();
const utils = require("../utils/main");
const { log } = utils;

module.exports = () => {

   const timeFormat = `${t.getHours()}H:${t.getMinutes()}m (${t.getDay()}D ${t.getMonth() + 1}M)`;
   log(`Iceberg bot (${cfg.bot.id})\n+=+==========+=+\n${timeFormat}\n+=+==========+=+`);

   // #region List commands
   fs.readdir("./file/commands/", (err, files) => {
      if (err) { log(err); return; }
      if (files.length <= 0) { log("No commands!"); return; }
      log("Commands found:");
      files.forEach((file, i) => log(`   - (${i + 1}) ${file}`));
   });
   // #endregion
};

// de lucrat