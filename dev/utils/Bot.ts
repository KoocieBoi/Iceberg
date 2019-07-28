import { ClientOptions, Client } from "discord.js"

interface IBotOptions {
  token: string
  clientID: string
  prefix: string
  clientOptions?: ClientOptions
}

export class Bot {
  private client: Client
  private botOptions: IBotOptions

  constructor(options: IBotOptions) {
    this.botOptions = options

    if (!options.clientOptions) this.client = new Client()
    else this.client = new Client(options.clientOptions)
  }

  private start(): void {}
}
