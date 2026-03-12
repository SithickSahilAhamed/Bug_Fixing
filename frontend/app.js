const API_BASE = "http://localhost:5000";

async function login(){
  const username=document.getElementById("username").value
  const password=document.getElementById("password").value

  try {
    const res = await fetch(`${API_BASE}/auth/login`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username,password})
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem("token", data.token)
      window.location.href="dashboard.html"
    } else {
      alert(data.error || "Login failed")
    }
  } catch (e) {
    console.error("Login error", e)
  }
}

async function register(){
  const username=document.getElementById("username").value
  const password=document.getElementById("password").value

  try {
    const res = await fetch(`${API_BASE}/auth/register`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username,password})
    })
    const data = await res.json()
    if (data.error) {
      alert(data.error)
    } else {
      alert("registered")
      window.location.href="login.html"
    }
  } catch (e) {
    console.error("Register error", e)
  }
}

async function createNote(){
  const title=document.getElementById("title").value
  const content=document.getElementById("content").value
  const token = localStorage.getItem("token")

  try {
    const res = await fetch(`${API_BASE}/notes/create`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization": token
      },
      body:JSON.stringify({title,content})
    })
    const data = await res.json()
    if(data.error) {
      alert(data.error)
    } else {
      alert("note added")
      document.getElementById("title").value = ""
      document.getElementById("content").value = ""
      fetchNotes()
    }
  } catch(e) {
    console.error(e)
  }
}

async function fetchNotes() {
  const token = localStorage.getItem("token")
  if(!token) {
    window.location.href="login.html"
    return
  }
  try {
    const res = await fetch(`${API_BASE}/notes`, {
      headers: { "Authorization": token }
    })
    const notes = await res.json()
    if (notes.error) {
      alert(notes.error)
      if (notes.error === "Invalid token" || notes.error === "Access denied") {
        localStorage.removeItem("token")
        window.location.href="login.html"
      }
      return
    }
    
    const notesDiv = document.getElementById("notes")
    if(notesDiv) {
      notesDiv.innerHTML = notes.map(n => `
        <div style="border:1px solid #ccc; padding:10px; margin: 10px 0;">
          <h3>${n.title}</h3>
          <p>${n.content}</p>
          <button onclick="deleteNote(${n.id})">Delete</button>
        </div>
      `).join('')
    }
  } catch(e) {
    console.error(e)
  }
}


function logout() {
  localStorage.removeItem("token")
  window.location.href = "login.html"
}

if(window.location.pathname.includes("dashboard.html")) {
  document.addEventListener("DOMContentLoaded", fetchNotes)
}
