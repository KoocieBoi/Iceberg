import { Client } from "discord.js"
import { readdir } from  "fs"
import { log } from "./Util/logger"
import databases from "./Util/databases"

const { credentials, bot } = require("../Data/config.json")

class Bot {
   client: Client
   botOptions: OptionsInterface
   
   constructor (options : OptionsInterface) {
      if (options.clientOptions) this.client = new Client(options.clientOptions)
      else this.client = new Client()
      this.botOptions = options
   }

   public start () : void {
      const { client } = this,
         { token } = this.botOptions;
      if (this.loadDatabases()) {
         this.logIntoBot(client, token)
         this.loadEvents(client)
      }
      else log.error("Not logging into the bot because not all enmap databases loaded successfully.")
   }

   private logIntoBot(client: Client, token : string) : void {
      client.login(token)
         .then(() => log.info(`Successfully logged in as ${client.user.tag}!`))
         .catch(error => log.error(error))
   }

   private loadEvents(client: Client) : void {
      readdir("./BotFiles-js/Events", (encounteredError, files) => {
         if (encounteredError) log.error(encounteredError)
         files.forEach(event => {
            if (!event.endsWith(".js")) return
            let eventName = event.split(".")[0]
            const executeEvent = require(`./Events/${event}`)
            
            client.on(eventName, (...args) =>
               executeEvent.run(client, ...args)
            )
         })
      })
   }

   private loadDatabases() : boolean {
      let goodDbs = true
      for (let database in databases) {
         databases[database].defer
            .then(() => log.info(`Loaded the "${database}" enmap database!`))
            .catch(error => {
               goodDbs = !goodDbs
               log.error(`Could not load the "${database}" enmap database.\n${error}`)
            })
      }
      return (goodDbs) ? true : false
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
