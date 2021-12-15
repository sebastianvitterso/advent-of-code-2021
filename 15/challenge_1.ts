import { readFileSync } from 'fs'

const MIN_COORD = 0
const MAX_COORD = 99

class Coordinate {
  weight: number = Infinity
  parent: Coordinate|null = null
  distance: number = Infinity

  neighbors: Coordinate[] = []

  constructor(public x: number, public y: number) {}

  toString(): string {
    return `(${this.x},${this.y})`
  }

  setNeighbors(neighbors: Coordinate[]) {
    this.neighbors = neighbors
  }

  setWeight(weight: number) {
    this.weight = weight
  }
}

const weightMap: number[][] = String(readFileSync('./input.txt'))
    .split('\n')
    .map(line => line.trim().split('').map(numStr => parseInt(numStr)))

const coordinateMap: Coordinate[][] = new Array(100).fill(0).map((_, y) => (new Array(100)).fill(0).map((_, x) => new Coordinate(x,y)))
for (let y = MIN_COORD; y <= MAX_COORD; y++) {
  for (let x = MIN_COORD; x <= MAX_COORD; x++) {
    coordinateMap[y][x].setNeighbors([
        coordinateMap[y+1]?.[x],
        coordinateMap[y-1]?.[x],
        coordinateMap[y]?.[x+1],
        coordinateMap[y]?.[x-1],
      ]
      .filter(coord => coord !== undefined))
    coordinateMap[y][x].setWeight(weightMap[y][x])
  }
}

const coordinates = coordinateMap.flat()
const startCoordinate = coordinates.find(coord => coord.x == MIN_COORD && coord.y == MIN_COORD)!
const endCoordinate = coordinates.find(coord => coord.x ==MAX_COORD && coord.y ==MAX_COORD)!
startCoordinate.distance = 0

const queue: Coordinate[] = [...coordinates]

while (queue.length > 0) {
  queue.sort((a, b) => a.distance - b.distance) // sort from low to high
  const coordinate = queue.shift()!

  for(const neighbor of coordinate.neighbors) {
    if(neighbor.distance >= coordinate.distance + neighbor.weight) {
      neighbor.distance = coordinate.distance + neighbor.weight
      neighbor.parent = coordinate
    }
  }

}

console.log(endCoordinate.distance)


