import cfg from "./.data/config";
import { on, login } from "./file/utils/main";
import events from "./file/events/events";


login(cfg.credentials.token);
on("ready", () => events.ready());
on("message", (msg, client) => events.message(msg, client))