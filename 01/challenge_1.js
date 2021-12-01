import { readFileSync } from 'fs'

const fileContents = readFileSync('./input.txt').toString()
const numbers = fileContents.split('\r\n').map(line => Number.parseInt(line))

let increaseCount = 0
let lastValue = Infinity
for(const number of numbers) {
  if(number > lastValue) {
    increaseCount++
  }
  lastValue = number
}

console.log(increaseCount)
