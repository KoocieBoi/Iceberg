import { Client } from "discord.js"
import { readdir } from  "fs"
import { log } from "./Util/logger"

const { credentials, bot } = require("../Data/config.json")

class Bot {
   client: Client
   botOptions: OptionsInterface
   
   constructor (options : OptionsInterface) {
      if (options.clientOptions) this.client = new Client(options.clientOptions)
      else this.client = new Client()
      this.botOptions = options;
   }
   start () : void {
      let { client } = this,
         { token } = this.botOptions;

      logIntoBot(client, token)
      loadEvents(client)
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

function logIntoBot(client: Client, token : string) : void {
   client.login(token)
      .then(() => log.info(`Successfully logged in as ${client.user.tag}!`))
      .catch(error => log.error(error))
}

function loadEvents(client: Client) : void {
   readdir("./BotFiles-js/Events", (encounteredError, files) => {
      if (encounteredError) log.error(encounteredError)
      files.forEach(event => {
         if (!event.endsWith(".js")) return
         let eventName = event.split(".")[0]
         let executeEvent = require(`./Events/${event}`)
         
         client.on(eventName, (...args) =>
            executeEvent.run(client, ...args)
         )
      })
   })
}

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
