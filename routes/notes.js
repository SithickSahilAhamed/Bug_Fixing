const express=require("express")
const router=express.Router()
const controller=require("../controllers/noteController")
const cryptoService=require("../services/cryptoService")

//Security Bug Fix: authMiddleware added to protect all /notes routes
// Old code had NO authentication on notes 
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")
  if (!token) return res.status(401).json({error: "Access denied"})

  try {
    //verifyToken checks signature, expiry, and handles Bearer/quotes
    req.user = cryptoService.verifyToken(token)
    next()
  } catch (err) {
    //specific message for expired tokens vs invalid signature
    if (err.message === "Token expired") {
      return res.status(401).json({error: "Token expired"})
    }
    res.status(400).json({error: "Invalid token"})
  }
}

//protect every /notes sub-route with authMiddleware
router.use(authMiddleware)
router.get("/",controller.getNotes)
// CHANGE #18 - Syntax Bug Fix: old code used wrong path "/notes/add" → now "/notes/create"
router.post("/create",controller.createNote)
router.delete("/:id",controller.deleteNote)

module.exports=router