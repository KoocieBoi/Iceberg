import { Command } from "../Util/command"
import { Client, Message } from "discord.js"
import { log } from "../Util/logger"
import { setCooldown } from "../Util/command"

export default class extends Command {
   constructor() {
      super({
         name: "test",
         aliases: ["ok"],
         ownerOnly: false,
         cooldown: {
            amount: 1,
            unit: "m"
         }
      })
   }
   public run(client: Client, message: Message, args: string[], command: string) {
      message.channel.send("WORKS! gj")
         .then((sentMessage: Message) => log.info(`Successfully sent TEST command response. (SENT ID: ${sentMessage.id})`))
         .then(() => setCooldown(this.options.name, message.author.id))
   }
}