const service=require("../services/noteService")

exports.getNotes=(req,res)=>{
const notes=service.getNotes()
res.json(notes)
}

exports.createNote=(req,res)=>{
const note=service.create(req.body)
res.json(note)
}

exports.deleteNote=(req,res)=>{
service.delete(req.params.id)
res.json({message:"deleted"})
}