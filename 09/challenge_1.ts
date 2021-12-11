import { readFileSync } from 'fs'

const rows: number[][] = String(readFileSync('./input.txt')).split('\n').map(line => line.trim().split('').map(numStr => parseInt(numStr)))
let sumOfRisk = 0

const height = rows.length
const width = rows[0].length
for(let y = 0; y < height; y++) {
  for(let x = 0; x < width; x++) {
    const number = rows[y][x]
    const left = rows[y][x-1] ?? 9
    const right = rows[y][x+1] ?? 9
    const up = rows[y-1]?.[x] ?? 9
    const down = rows[y+1]?.[x] ?? 9
    if([left, right, up, down].every(direction => direction > number)) {
      sumOfRisk += (number + 1)
    }
  }
}

console.log(sumOfRisk)