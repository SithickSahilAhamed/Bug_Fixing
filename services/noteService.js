const {readData,writeData}=require("../utils/fileStorage")
const generateId=require("../utils/idGenerator")
const cryptoService=require("./cryptoService")

const FILE="data/notes.json"

//Security Bug Fix: notes are now scoped to a specific user
// Old code returned ALL notes to ANY logged-in user
//Logical Bug Fix: content is decrypted before being returned
//Old code sent the raw encrypted hex string to the frontend — unreadable
exports.getNotes=function(userId){
  const notes = readData(FILE)
  //filter by userId so each user only sees their own notes
  const userNotes = notes.filter(n => n.userId === userId)
  return userNotes.map(n => ({
    ...n,
   // decrypt content so the browser receives readable text
    content: cryptoService.decrypt(n.content)
  }))
}

//userId is stored with the note so ownership is tracked
//content is encrypted with AES-256-CBC before saving
exports.create=function(data, userId){
  if(!data.title || !data.content) throw new Error("Missing data")
  const notes=readData(FILE)
  const note={
    id:generateId(notes),
    //attach userId to every new note
    userId: userId,
    title:data.title,
    //encrypt note content before saving to disk
    content:cryptoService.encrypt(data.content)
  }
  notes.push(note)
  writeData(FILE,notes)
  return { id: note.id, title: note.title, content: data.content }
}

//Security Bug Fix: ownership check on delete
exports.delete=function(id, userId){
  const notes=readData(FILE)
  const note = notes.find(n => n.id == id)
  //only the note's owner can delete it (403 is thrown otherwise)
  if(!note || note.userId !== userId) throw new Error("Unauthorized or not found")
  const list=notes.filter(n=>n.id!=id)
  writeData(FILE,list)
}