const express=require("express")
const router=express.Router()
const controller=require("../controllers/noteController")
const cryptoService=require("../services/cryptoService")

// CHANGE #17 - Security Bug Fix: authMiddleware added to protect all /notes routes
// Old code had NO authentication on notes — any anonymous request could read/write notes
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")
  if (!token) return res.status(401).json({error: "Access denied"})

  try {
    // CHANGE #5 + #6: verifyToken checks signature, expiry, and handles Bearer/quotes
    req.user = cryptoService.verifyToken(token)
    next()
  } catch (err) {
    // CHANGE #7: specific message for expired tokens vs invalid signature
    if (err.message === "Token expired") {
      return res.status(401).json({error: "Token expired"})
    }
    res.status(400).json({error: "Invalid token"})
  }
}

// CHANGE #17: protect every /notes sub-route with authMiddleware
router.use(authMiddleware)
router.get("/",controller.getNotes)
// CHANGE #18 - Syntax Bug Fix: old code used wrong path "/notes/add" → now "/notes/create"
router.post("/create",controller.createNote)
router.delete("/:id",controller.deleteNote)

module.exports=router