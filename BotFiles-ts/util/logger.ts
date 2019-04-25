import { format as logFormat } from "logform"
import * as wst from "winston"
import * as wstDRF from "winston-daily-rotate-file"

const d = new Date()
const dateFormat = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} @ ${d.getHours()}:${d.getMinutes()}`

const colors = {
   info: "green bold underline",
   warning: "yellow bold underline",
   error: "red bold underline",
   debug: "blue bold underline",
   silly: "magenta bold underline"
}
wst.addColors(colors)

const consoleLogFormat = logFormat.combine(
   wst.format.colorize({ colors }),
   wst.format.timestamp({
      format: dateFormat
   }),
   wst.format.printf(toLog => `(${toLog.timestamp}) ${toLog.level} ➜  ${toLog.message}`)
 )
const fileLogFormat = logFormat.combine(
   wst.format.timestamp({
      format: dateFormat
   }),
   wst.format.printf(toLog => `(${toLog.timestamp}) ${toLog.level}:  ${toLog.message}`)
)

export const log = wst.createLogger({
   level: "silly",
   transports: [
      new wst.transports.Console({
         format: consoleLogFormat
      }),
      new wst.transports.File({
         format: fileLogFormat,
         dirname: "logs",
         filename: "logs.log"
      }),
      new wstDRF({
         format: fileLogFormat,
         datePattern: "YYYY-MM-DD",
         filename: "daily-%DATE%.log",
         dirname: "Logs",
         maxSize: "10m",
         maxFiles: "5",
      })
   ],
   levels: {
      error: 0,
      warning: 1,
      debug: 2,
      info: 3,
      silly: 4
   },
   exitOnError: false
})
