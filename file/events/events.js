import msg from "./message"
import { log, on } from "../utils/main"
import ready from "./ready"

const events = {
   ready: () => ready(),
   message: (receivedMessage, client) => msg(receivedMessage, client)
}

export default events
