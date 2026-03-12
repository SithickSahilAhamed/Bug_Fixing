const crypto=require("crypto")
const key="mysecretkey"

exports.encrypt=function(text){
const cipher=crypto.createCipher("aes-256-cbc",key)
let encrypted=cipher.update(text,"utf8","hex")
encrypted+=cipher.final("hex")
return encrypted
}

exports.decrypt=function(text){
const decipher=crypto.createDecipher("aes-256-cbc",key)
let decrypted=decipher.update(text,"hex","utf8")
decrypted+=decipher.final("utf8")
return decrypted
}