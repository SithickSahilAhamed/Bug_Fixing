const {readData,writeData}=require("../utils/fileStorage")
const generateId=require("../utils/idGenerator")
const cryptoService=require("./cryptoService")

const FILE="data/notes.json"

exports.getNotes=function(){
return readData(FILE)
}

exports.create=function(data){
const notes=readData(FILE)
const note={
id:generateId(notes),
title:data.title,
content:cryptoService.encrypt(data.content)
}
notes.push(note)
writeData(FILE,notes)
return note
}

exports.delete=function(id){
const notes=readData(FILE)
const list=notes.filter(n=>n.id!=id)
writeData(FILE,list)
}