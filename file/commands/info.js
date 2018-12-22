import { RichEmbed } from "discord.js";

function exec (client, msg, cmd, args) {
   if (cmd === "info") {
      let embed = new RichEmbed()
         .attachFile("./file/.media/avatar.png")
         .setColor("#36393F")
         .setTitle("hello there!")
         .setThumbnail("attachment://avatar.png")
         .setTimestamp(new Date("2014-06-17"))
         .setFooter("now playing: Maroon 5 - Maps")
         .setDescription("i am a beautiful majestic 6'5\" black man with rippling muscles, gorgeous pink locks, sexy legs, married to all my 2d waifus who bore me eight beautiful children who are all diamond and challenger in league of legends. \n\nIcons made by [__Freepik__](http://www.freepik.com) from [__Flaticon__](https://www.flaticon.com/). Licensed under: [__CC 3.0 BY__](https://creativecommons.org/licenses/by/3.0/)");
      msg.channel.send({ embed });
   }
}

export { exec };