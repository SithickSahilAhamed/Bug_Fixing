const {readData,writeData}=require("../utils/fileStorage")
const generateId=require("../utils/idGenerator")

const FILE="data/users.json"

exports.register=function(data){
const users=readData(FILE)
const user={
id:generateId(users),
username:data.username,
password:data.password
}
users.push(user)
writeData(FILE,users)
return user
}

exports.login=function(data){
const users=readData(FILE)
const user=users.find(u=>u.username==data.username)
if(user.password==data.password){
return user
}
return {error:"invalid login"}
}