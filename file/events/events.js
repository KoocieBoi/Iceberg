import msg from "./message";
import ready from "./ready";

const events = {
   "ready": () => ready(),
   "message": (receivedMessage, client) => msg(receivedMessage, client)
};

export default events;
