const service=require("../services/authService")

exports.register=(req,res)=>{
const user=service.register(req.body)
res.json(user)
}

exports.login=(req,res)=>{
const user=service.login(req.body)
res.json(user)
}