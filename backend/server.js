const express=require("express")
const app=express()

const authRoutes=require("../routes/auth")
const noteRoutes=require("../routes/notes")

app.use(express.json())
app.use(express.static("frontend"))

app.use("/auth",authRoutes)
app.use("/notes",noteRoutes)

app.listen(3000,()=>{
console.log("Server running on port 3000")
})