let config = require("./.data/config");
let dep = require("./file/dep");
let { on, login } = dep;

login(config.credentials.token);
on("ready", () => console.log("ready"));
