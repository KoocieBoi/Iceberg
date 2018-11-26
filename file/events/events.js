import msg from "./message";
import ready from "./ready";

let events = {
    ready: () => ready(),
    message: (receivedMessage, client) => msg(receivedMessage, client)
};

export default events;