import { readFileSync } from 'fs'


class Coordinate {
  weight: number = Infinity
  parent: Coordinate|null = null
  distance: number = Infinity

  neighbors: Coordinate[] = []

  constructor(public x: number, public y: number) {}

  toString(): string {
    return `(${this.x},${this.y})`
  }
}

function getIncrementedWeightMap(increment: number) {
  const newWeightMap = baseWeightMap.map(row => [...row])
  for(const row of newWeightMap) {
    for(const [index, value] of row.entries()) {
      row[index] = (((value - 1) + increment) % 9) + 1
    }
  }
  return newWeightMap
}


const baseWeightMap: number[][] = String(readFileSync('./input.txt'))
    .split('\n')
    .map(line => line.trim().split('').map(numStr => parseInt(numStr)))

const BASE_SIZE = baseWeightMap.length

const weightMap: number[][] = []

for (let y = 0; y < 5; y++) {
  for (let x = 0; x < 5; x++) {
    const increment = x+y
    const currentWeightMap = getIncrementedWeightMap(increment)
    const yOffset = BASE_SIZE * y
    for(let yInner = 0; yInner < BASE_SIZE; yInner++) {
      if(weightMap[yInner + yOffset] === undefined) {
        weightMap[yInner + yOffset] = []
      }
  
      weightMap[yInner + yOffset].push(...currentWeightMap[yInner])
    }
  }
}

const SIZE = weightMap.length


const coordinateMap: Coordinate[][] = new Array(SIZE).fill(0).map((_, y) => (new Array(SIZE)).fill(0).map((_, x) => new Coordinate(x,y)))
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    coordinateMap[y][x].neighbors = [
        coordinateMap[y+1]?.[x],
        coordinateMap[y-1]?.[x],
        coordinateMap[y]?.[x+1],
        coordinateMap[y]?.[x-1],
      ].filter(coord => coord !== undefined)
    
    coordinateMap[y][x].weight = weightMap[y][x]
  }
}

const coordinates = coordinateMap.flat()
const startCoordinate = coordinates.find(coord => coord.x == 0 && coord.y == 0)!
const endCoordinate = coordinates.find(coord => coord.x == SIZE - 1 && coord.y == SIZE - 1)!
startCoordinate.distance = 0
coordinates.find(coord => coord.x == 0 && coord.y == 0)?.distance

let queue: Coordinate[] = [startCoordinate]

while (queue.length > 0) {
  queue.sort((a, b) => a.distance - b.distance)
  const coordinate = queue.shift()!

  for(const neighbor of coordinate.neighbors) {
    if(coordinate.distance + neighbor.weight < neighbor.distance) {
      neighbor.distance = coordinate.distance + neighbor.weight
      neighbor.parent = coordinate
      queue.push(neighbor)
    }
  }
}

console.log(endCoordinate.distance)


