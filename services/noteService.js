const {readData,writeData}=require("../utils/fileStorage")
const generateId=require("../utils/idGenerator")
const cryptoService=require("./cryptoService")

const FILE="data/notes.json"

// CHANGE #13 - Security Bug Fix: notes are now scoped to a specific user
// Old code returned ALL notes to ANY logged-in user
// CHANGE #14 - Logical Bug Fix: content is decrypted before being returned
// Old code sent the raw encrypted hex string to the frontend — unreadable
exports.getNotes=function(userId){
  const notes = readData(FILE)
  // CHANGE #13: filter by userId so each user only sees their own notes
  const userNotes = notes.filter(n => n.userId === userId)
  return userNotes.map(n => ({
    ...n,
    // CHANGE #14: decrypt content so the browser receives readable text
    content: cryptoService.decrypt(n.content)
  }))
}

// CHANGE #13 (continued): userId is stored with the note so ownership is tracked
// CHANGE #4 (continued): content is encrypted with AES-256-CBC before saving
exports.create=function(data, userId){
  if(!data.title || !data.content) throw new Error("Missing data")
  const notes=readData(FILE)
  const note={
    id:generateId(notes),
    // CHANGE #13: attach userId to every new note
    userId: userId,
    title:data.title,
    // CHANGE #4: encrypt note content before saving to disk
    content:cryptoService.encrypt(data.content)
  }
  notes.push(note)
  writeData(FILE,notes)
  return { id: note.id, title: note.title, content: data.content }
}

// CHANGE #15 - Security Bug Fix: ownership check on delete
// Old code deleted any note by ID without verifying who owned it
exports.delete=function(id, userId){
  const notes=readData(FILE)
  const note = notes.find(n => n.id == id)
  // CHANGE #15: only the note's owner can delete it (403 is thrown otherwise)
  if(!note || note.userId !== userId) throw new Error("Unauthorized or not found")
  const list=notes.filter(n=>n.id!=id)
  writeData(FILE,list)
}