const {readData,writeData}=require("../utils/fileStorage")
const generateId=require("../utils/idGenerator")
const crypto = require("crypto")
const cryptoService = require("./cryptoService")

const FILE="data/users.json"

// Security Bug Fix: hash passwords with SHA-256 before storing
// Old code stored plaintext passwords
function hashPassword(password) {
  return crypto.createHash("sha256").update(password || '').digest("hex")
}

//Logical Bug Fix: added duplicate username check on register
// Old code allowed multiple accounts with the same username causing login confusion
//Logical Bug Fix: added missing credentials validation
exports.register=function(data){
  if (!data.username || !data.password) return {error: "Missing credentials"}
  const users=readData(FILE)
  // reject if username already taken
  if(users.find(u => u.username === data.username)) {
    return {error: "username taken"}
  }
  const user={
    id:generateId(users),
    username:data.username,
    //store hashed password
    password:hashPassword(data.password)
  }
  users.push(user)
  writeData(FILE,users)
  // Never return the password hash to the client
  return { id: user.id, username: user.username }
}

//Logical Bug Fix: added user-not-found check on login
// Old code would crash when user was null. compare hashed passwords on login
exports.login=function(data){
  const users=readData(FILE)
  const user=users.find(u=>u.username==data.username)
  //It make save the server crash
  if(!user){
    return {error:"invalid login"}
  }
  if(user.password==hashPassword(data.password)){
    //generate a signed JWT-like token on successful login
    const token = cryptoService.generateToken({id: user.id, username: user.username})
    return { token, username: user.username }
  }
  return {error:"invalid login"}
}

//New Feature: GET /auth/users returns all registered users
// Returns only id and username not expose a password
exports.getAllUsers = function() {
  const users = readData(FILE)
  return users.map(u => ({ id: u.id, username: u.username }))
}