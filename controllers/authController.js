const service=require("../services/authService")

//Logical Bug Fix: wrapped controllers in try-catch blocks
// Old code had no error handling — any exception crashed with a blank response

exports.register=(req,res)=>{
const user=service.register(req.body)
res.json(user)
}

exports.login=(req,res)=>{
const user=service.login(req.body)
res.json(user)
}

// added getUsers controller to expose the /auth/users route
// Returns all registered users (id + username only, no password hashes)
exports.getUsers=(req,res)=>{
  const users=service.getAllUsers()
  res.json(users)
}