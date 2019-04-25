import Enmap = require("enmap")

export default {
   cooldowns: new Enmap({
      name: "cooldowns",
      dataDir: "./Data/Databases"
   })
}