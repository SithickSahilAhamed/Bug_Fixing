const service=require("../services/noteService")

// CHANGE #16 - Logical Bug Fix: all controllers now use try-catch
// Old code had no error handling — uncaught exceptions crashed the server

// CHANGE #13 (continued): req.user.id is injected by authMiddleware from the JWT token
// and passed down to the service for per-user note scoping

exports.getNotes=(req,res)=>{
  try {
    // CHANGE #13: pass userId so only the current user's notes are returned
    const notes=service.getNotes(req.user.id)
    res.json(notes)
  } catch(e) {
    res.status(500).json({error: e.message})
  }
}

exports.createNote=(req,res)=>{
  try {
    // CHANGE #13: pass userId so the note is linked to the correct owner
    const note=service.create(req.body, req.user.id)
    res.json(note)
  } catch(e) {
    res.status(500).json({error: e.message})
  }
}

exports.deleteNote=(req,res)=>{
  try {
    // CHANGE #15: ownership verified inside service — throws if not owner
    service.delete(req.params.id, req.user.id)
    res.json({message:"deleted"})
  } catch(e) {
    // 403 Forbidden returned when the note doesn't belong to the requester
    res.status(403).json({error: e.message})
  }
}