import { Client } from "discord.js"
import { readdir } from  "fs"
import * as winston from "winston"
import chalk from "chalk"

const { credentials } = require("../Data/config.json")

interface ClientOptionsInterface {
   apiRequestMethod? : string,
   shardId? : number,
   shardCount? : number,
   messageCacheMaxSize? : number,
   messageCacheLifetime? : number,
   messageSweepInterval? : number,
   fetchAllMembers? : boolean,
   disableEveryone?: boolean,
   sync? : boolean,
   restWsBridgeTimeout? : number,
   restTimeOffset? : number
}

interface OptionsInterface {
   token: string,
   clientOptions? : ClientOptionsInterface
}

export class Bot {
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
   token: credentials.token
})

IcebergEntity.start()

export { Client }

function logIntoBot(client: Client, token : string) : void {
   client.login(token)
      .then(() => console.log("good"))
}

function loadEvents(client: Client) : void {
   readdir("./BotFiles-js/Events", (encounteredError, files) => {
      if (encounteredError) console.log(encounteredError)
      files.forEach(event => {
         if (!event.endsWith(".js")) return //note
         let eventName = event.split(".")[0]
         let executeEvent = require(`./Events/${event}`)
         // log
         
         client.on(eventName, (...args) => {
            executeEvent.run(client, ...args)
         })
      })
   })
}