import { readFileSync } from 'fs'

const numbers: number[] = String(readFileSync('./input.txt')).split(',').map(numStr => parseInt(numStr))
const minValue = numbers.reduce((min, curr) => Math.min(min, curr))
const maxValue = numbers.reduce((max, curr) => Math.max(max, curr))

let bestPosition = 0
let bestDiffSum = Infinity
for(let position = minValue; position <= maxValue; position++) {
  const diffSum = numbers.reduce((diffAccumulator, number) => diffAccumulator + Math.abs(number - position), 0)
  console.log(`${position} has diffSum ${diffSum}`)
  if(diffSum < bestDiffSum) {
    bestPosition = position
    bestDiffSum = diffSum
  }
}

console.log(bestPosition, bestDiffSum)
