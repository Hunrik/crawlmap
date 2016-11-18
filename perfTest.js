
let arr = []
console.time('#1 total')
for(let i = 0; i < 5000000; i++) {
  let rand = Math.round(Math.random * 10000)
  arr.push(rand)
  arr = [ ...new Set(arr) ]
}
console.timeEnd('#1 total')
arr = []
console.time('#2 total')
for(let i = 0; i < 5000000; i++) {
  let rand = Math.round(Math.random * 10000)
  arr.push(rand)
  arr = [ ...new Set(arr) ]
}
console.timeEnd('#2 total')
arr = []
console.time('#3 total')
for(let i = 0; i < 5000000; i++) {
  let rand = Math.round(Math.random * 10000)
  arr.push(rand)
  arr = [ ...new Set(arr) ]
}
console.timeEnd('#3 total')
