import { readFileSync } from 'fs'
import Map from './Map'

const lines = String(readFileSync('./input.txt')).split('\n').map(line => line.trim())
const map = Map.fromInputLines(lines, false)

console.log(map.getIntersectionCount())