// CHANGE #3 - Logical Bug Fix: replaced list.length + 1 with Math.max(...ids) + 1
// Old logic: if 3 items existed, next ID = 4. But after deleting item 2,
// list.length=2 so next ID=3 which CONFLICTS with existing ID 3.
// New logic: always picks the highest existing ID and adds 1 = truly unique IDs.
module.exports=function(list){
return list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1
}