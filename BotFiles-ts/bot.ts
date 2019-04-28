import { Client } from "discord.js"
import { readdir } from "fs"
import { log } from "./Util/logger"
const config = require("../Data/config.json")
import databases from "./Util/databases"

const { credentials, bot }  = config

class Bot {
   public client: Client
   public botOptions: OptionsInterface

   constructor(options: OptionsInterface) {
      if (options.clientOptions) this.client = new Client(options.clientOptions)
      else this.client = new Client()
      this.botOptions = options
   }

   public start() : void {
      const { client } = this
      const { token } = this.botOptions
      if (this.loadDatabases()) {
         this.logIntoBot(client, token)
         this.loadEvents(client)
      }
      else log.error("Not logging into the bot because not all enmap databases loaded successfully.")
   }

   private logIntoBot(client: Client, token: string) : void {
      client.login(token)
         .then(() => log.info(`Successfully logged in as ${client.user.tag}!`))
         .catch(error => log.error(error))
   }

   private loadEvents(client: Client) : void {
      readdir("./BotFiles-js/Events", (encounteredError, files) => {
         if (encounteredError) log.error(encounteredError)
         files.forEach(event => {
            if (!event.endsWith(".js")) return
            const eventName = event.split(".")[0]
            const executeEvent = require(`./Events/${event}`)

            client.on(eventName, (...args) =>
               executeEvent.run(client, ...args)
            )
         })
      })
   }

   private loadDatabases() : boolean {
      let isGoodDB = true

      for (const database in databases) {
         databases[database].defer
            .then(() => log.info(`Loaded the "${database}" enmap database!`))
            .catch(error => {
               isGoodDB = !isGoodDB
               log.error(`Could not load the "${database}" enmap database.\n${error}`)
            })
      }

      return (isGoodDB) ? true : false
   }
   get options() : OptionsInterface {
      return this.botOptions
   }
}

const IcebergEntity = new Bot({
   token: credentials.token,
   clientID: bot.id,
   prefix: bot.prefix
})

IcebergEntity.start()

interface ClientOptionsInterface {
   apiRequestMethod?: string,
   shardId?: number,
   shardCount?: number,
   messageCacheMaxSize?: number,
   messageCacheLifetime?: number,
   messageSweepInterval?: number,
   fetchAllMembers?: boolean,
   disableEveryone?: boolean,
   sync?: boolean,
   restWsBridgeTimeout?: number,
   restTimeOffset?: number
}

interface OptionsInterface {
   token: string,
   clientID: string,
   prefix: string
   clientOptions?: ClientOptionsInterface
}
