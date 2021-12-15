import { readFileSync } from 'fs'

const numbers: number[] = String(readFileSync('./input.txt')).split(',').map(numStr => parseInt(numStr))
const minValue = numbers.reduce((min, curr) => Math.min(min, curr))
const maxValue = numbers.reduce((max, curr) => Math.max(max, curr))

let bestPosition = 0
let bestDiffSum = Infinity
for(let position = minValue; position <= maxValue; position++) {
  let diffSum = 0
  for(const number of numbers) {
    const diff = Math.abs(number - position)
    diffSum += (diff*diff + diff) / 2
  }
  console.log(`${position} has diffSum ${diffSum}`)
  if(diffSum < bestDiffSum) {
    bestPosition = position
    bestDiffSum = diffSum
  }
}

console.log(bestPosition, bestDiffSum)
