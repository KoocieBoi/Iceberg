import { Client } from "discord.js";
let cl = new Client();

export let login = (token) => cl.login(token);
export let on = (event, func) => cl.on(event, func);

export let isArr = (array) => { return Array.isArray(array); };
export let isObj = (object) => { return !Array.isArray(object) && typeof object === "object"; };
export let isStr = (string) => { return typeof string === "string"; };
export let log = (msg) => { console.log(msg); };