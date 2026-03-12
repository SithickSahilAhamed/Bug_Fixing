const express=require("express")
const router=express.Router()
const controller=require("../controllers/noteController")

router.get("/",controller.getNotes)
router.post("/create",controller.createNote)
router.delete("/:id",controller.deleteNote)

module.exports=router