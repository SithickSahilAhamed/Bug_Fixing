const express=require("express")
const app=express()

const authRoutes=require("../routes/auth")
const noteRoutes=require("../routes/notes")

// CHANGE-Backend moved to port 5000
// This separates the two concerns and enables independent scaling

//Security Feature: CORS middleware added
// Allows requests from the frontend at localhost:3000 to reach the API at localhost:5000
// Without this, the browser would block all cross-origin API calls
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  // Handle pre-flight OPTIONS requests from the browser
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }
  next()
})

app.use(express.json())

//static frontend serving removed
app.use("/auth",authRoutes)
app.use("/notes",noteRoutes)

app.listen(5000,()=>{
console.log("Backend API running on port 5000")
})