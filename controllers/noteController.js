const service=require("../services/noteService")

//  Logical Bug Fix: all controllers now use try-catch
// Old code had no error handling — uncaught exceptions crashed the server

// req.user.id is injected by authMiddleware from the JWT token
// and passed down to the service for per-user note scoping

exports.getNotes=(req,res)=>{
  try {
    //pass userId so only the current user's notes
    const notes=service.getNotes(req.user.id)
    res.json(notes)
  } catch(e) {
    res.status(500).json({error: e.message})
  }
}

exports.createNote=(req,res)=>{
  try {
    //pass userId so the note is linked to the correct owner
    const note=service.create(req.body, req.user.id)
    res.json(note)
  } catch(e) {
    res.status(500).json({error: e.message})
  }
}

exports.deleteNote=(req,res)=>{
  try {
    // ownership verified inside service — throws if not owner
    service.delete(req.params.id, req.user.id)
    res.json({message:"deleted"})
  } catch(e) {
    //error message
    res.status(403).json({error: e.message})
  }
}