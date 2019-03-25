// import { RichEmbed } from "discord.js";
import cfg from "../../.data/config"
import fs from "fs"
import { inlineLists } from "common-tags"
import { log } from "../utils/main"
import { notEnoughPermissions } from "../errors/notEnoughPermissions"
import { ownerOnlyCommand } from "../errors/ownerOnlyCommand"

const eventExec = (msg, client) => {
   const pfx = {
      letter: cfg.bot.letterPrefix,
      mention: cfg.bot.mentionPrefix
   }

   /* eslint max-statements-per-line: [1, { "max": 2 }] */
   if (msg.author.bot || msg.channel.type !== "text") { return }
   if (!msg.content.startsWith(pfx.letter) && !msg.content.startsWith(pfx.mention)) { return }

   let sliceLength

   if (msg.content.startsWith(pfx.letter)) {
      sliceLength = pfx.letter.length
   }
   else if (msg.content.startsWith(pfx.mention)) {
      sliceLength = pfx.mention.length
   }

   const args = msg.content.slice(sliceLength).trim().split(" "),
      cmd = args.shift().toLowerCase()

   fs.readdir("./file/commands", (err, files) => {
      if (err) {
         log(err)
         return
      }
      if (files.length <= 0) { return }

      files.forEach(file => {
         const command = require(`../commands/${file}`)

         const { aliases, ownerOnly, perms } = command.settings

         if (aliases.indexOf(cmd) === -1) { return }
         if (ownerOnly && msg.author.id !== cfg.ownerID) {
            return msg.channel.send({
               embed: ownerOnlyCommand
            })
         }
         if (perms) {
            const botMember = msg.guild.member(cfg.bot.id),
               botPerms = msg.guild.member(cfg.bot.id).permissions,
               memberPerms = msg.member.permissions

            if (perms.member && !memberPerms.has(perms.member)) {
               return msg.channel.send({
                  embed: notEnoughPermissions(msg.member, memberPerms.toArray())
               })
            }
            if (perms.bot && !botPerms.has(perms.bot)) {
               return msg.channel.send({
                  embed: notEnoughPermissions(botMember, botPerms.toArray())
               })
            }
         }

         command.exec(client, msg, cmd, args)
      })
   })
}

export default eventExec
