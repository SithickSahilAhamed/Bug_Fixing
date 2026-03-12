async function login(){
const username=document.getElementById("username").value
const password=document.getElementById("password").value

await fetch("/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({username,password})
})
window.location="dashboard.html"
}

async function register(){
const username=document.getElementById("username").value
const password=document.getElementById("password").value

await fetch("/auth/registration",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({username,password})
})
alert("registered")
}

async function createNote(){
const title=document.getElementById("title").value
const content=document.getElementById("content").value

await fetch("/create",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({title,content})
})
alert("note added")
}