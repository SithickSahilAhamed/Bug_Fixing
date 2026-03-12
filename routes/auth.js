const express=require("express")
const router=express.Router()
const controller=require("../controllers/authController")

router.post("/register",controller.register)
router.post("/login",controller.login)
// CHANGE #12 - New Feature: GET /auth/users returns all registered users (id + username)
// Useful for admin inspection or debugging via Thunder Client
router.get("/users",controller.getUsers)

module.exports=router