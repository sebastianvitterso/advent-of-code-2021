import { readFileSync } from 'fs'

const rows: number[][] = String(readFileSync('./input.txt')).split('\n').map(line => line.trim().split('').map(numStr => parseInt(numStr)))

type Coordinate = {
  x: number,
  y: number
}
type Basin = {
  coordinates: Coordinate[]
}

// each string is of form x,y so e.g. '12,17'
const visitedCoordinates: Set<string> = new Set()
const basins: Basin[] = []

const height = rows.length
const width = rows[0].length
for(let y = 0; y < height; y++) {
  for(let x = 0; x < width; x++) {
    if(!visitedCoordinates.has(`${x},${y}`)) {
      const basin: Basin = { coordinates: [] }
      const coordinateQueue: Coordinate[] = [{x,y}]
      while(coordinateQueue.length > 0) {
        const coordinate = coordinateQueue.shift()!
        if(visitedCoordinates.has(`${coordinate.x},${coordinate.y}`)) continue
        visitedCoordinates.add(`${coordinate.x},${coordinate.y}`)

        const number = rows[coordinate.y]?.[coordinate.x] ?? 9
        if(number === 9) continue

        basin.coordinates.push(coordinate)

        const left = { x: coordinate.x - 1, y: coordinate.y }
        const right = { x: coordinate.x + 1, y: coordinate.y }
        const up = { x: coordinate.x, y: coordinate.y - 1 }
        const down = { x: coordinate.x, y: coordinate.y + 1 }
        coordinateQueue.push(left,right,up,down)
      }
      basins.push(basin)
    }
  }
}

console.log(
  basins
    .sort((basinA, basinB) => basinA.coordinates.length - basinB.coordinates.length)
    .reverse()
    .map(basin => basin.coordinates.length)
    .slice(0,3)
    .reduce((product, basinLength) => product * basinLength, 1)
)
