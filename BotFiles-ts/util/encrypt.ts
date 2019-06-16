import crypto from "crypto"
const { encrypt } = require("../../Data/config.json")
const { encryptionKey, salt } = encrypt

let key = crypto.pbkdf2Sync(encryptionKey, salt, 100000, 32, "sha256")
key = Buffer.from(key)

function crypt(toCrypt) : string {
   const initializationVector = crypto.randomBytes(16)
   const cipher = crypto.createCipheriv("aes-256-cbc", key, initializationVector)
   let crypted = cipher.update(toCrypt)
   crypted = Buffer.concat([ crypted, cipher.final() ])
   return initializationVector.toString("hex") + "::" + crypted.toString("hex")
}

function decrypt(toDecrypt) : string {
   const cryptedArray = toDecrypt.split("::") // => [iv , cryptedstring]
   const initializationVector = Buffer.from(cryptedArray.shift(), "hex")

   const encrypted = Buffer.from(cryptedArray[0], "hex")

   const decipher = crypto.createDecipheriv("aes-256-cbc", key, initializationVector)
   let decrypted = decipher.update(encrypted)

   decrypted = Buffer.concat([ decrypted, decipher.final() ])
   return decrypted.toString()
}

export { crypt, decrypt }
