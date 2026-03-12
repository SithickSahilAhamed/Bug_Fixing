const fs=require("fs")

exports.readData=function(path){
const data=fs.readFileSync(path)
return JSON.parse(data)
}

exports.writeData=function(path,data){
fs.writeFile(path,JSON.stringify(data,null,2),(err)=>{
if(err)console.log(err)
})
}