const fs=require("fs")

// CHANGE #1 - Async Bug Fix: replaced async fs.writeFile with sync fs.writeFileSync
// Prevents race conditions where data was lost when multiple writes overlapped

// CHANGE #2 - Logical Bug Fix: added try-catch and empty-check on readData
// Prevents server crash when file is missing or contains invalid/empty JSON

exports.readData=function(path){
  try {
    const data=fs.readFileSync(path, 'utf8')
    // CHANGE #2: Return empty array instead of crashing on empty file
    return data ? JSON.parse(data) : []
  } catch (err) {
    return []
  }
}

exports.writeData=function(path,data){
  // CHANGE #1: Synchronous write with error handling to prevent data loss
  try {
    fs.writeFileSync(path,JSON.stringify(data,null,2))
  } catch (err) {
    console.error("Write error:", err)
  }
}