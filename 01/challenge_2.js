import { readFileSync } from 'fs'

const fileContents = readFileSync('./input.txt').toString()
const numbers = fileContents.split('\r\n').map(line => Number.parseInt(line)) // [1,2,3,2,3,4,5...]

let increaseCount = 0
let lastSum = Infinity
let lastValues = [Infinity, Infinity, Infinity]
for(const number of numbers) {
  const currentValues = [...lastValues.slice(1,3), number]
  const currentSum = currentValues.reduce((sum, current, idx) => sum + current)
  if(currentSum > lastSum) {
    increaseCount++
  }
  console.log(currentValues, currentSum, increaseCount)
  lastValues = currentValues
  lastSum = currentSum
}

console.log(increaseCount)
