import { readFileSync } from 'fs'

// run slowly to show slightly cool animation in terminal
const RUN_SLOWLY = false
const TIMEOUT = 500 // only relevant if RUN_SLOWLY === true
const TOTAL_TIMESTEPS = 100

let flashCounter = 0

class Map {
  octopuses: Octopus[][]
  constructor(rows: number[][]) {
    this.octopuses = rows.map(row => row.map(energyLevel => new Octopus(energyLevel)))
    for (let y = 0; y < this.octopuses.length; y++) {
      for (let x = 0; x < this.octopuses[y].length; x++) {
        const octopus = this.octopuses[y][x]
        const neighbors: Octopus[] = [
          this.octopuses[y-1]?.[x-1] ?? undefined,
          this.octopuses[y-1]?.[ x ] ?? undefined,
          this.octopuses[y-1]?.[x+1] ?? undefined,
          this.octopuses[ y ]?.[x-1] ?? undefined,
          // this.octopuses[ y ]?.[ x ] ?? undefined, // we don't want to call ourself our own neighbour
          this.octopuses[ y ]?.[x+1] ?? undefined,
          this.octopuses[y+1]?.[x-1] ?? undefined,
          this.octopuses[y+1]?.[ x ] ?? undefined,
          this.octopuses[y+1]?.[x+1] ?? undefined,
        ]
        .filter((octo: Octopus | undefined) : octo is Octopus => !!octo) // filter out undefined (neighbours of octopuses on the edge!)

        octopus.setNeighbors(neighbors)
      }
    }
  }

  public toString(): string {
    return this.octopuses.map(octopusRow => octopusRow.map(octopus => octopus.toString()).join('')).join('\n')
  }

  public runTimestep() {
    this.beginTimestep()
    this.endTimestep()
  }

  private beginTimestep() {
    this.octopuses.forEach(octopusRow => octopusRow.forEach(octopus => octopus.beginTimestep()))
  }

  private endTimestep() {
    this.octopuses.forEach(octopusRow => octopusRow.forEach(octopus => octopus.endTimestep()))
  }
}

class Octopus {
  energyLevel: number
  hasFlashedThisRound: boolean = false
  neighbors: Octopus[] = []

  constructor(energyLevel: number) {
    this.energyLevel = energyLevel
  }

  public toString(): string {
    if(this.energyLevel === 0) {
      return `\x1b[1m[${this.energyLevel}]\x1b[0m`
    } else {
      return `\x1b[2m ${this.energyLevel} \x1b[0m`
    }
  }

  public setNeighbors(neighbors: Octopus[]) {
    this.neighbors = neighbors
  }

  public beginTimestep() {
    this.increaseEnergyLevel()
  }

  public increaseEnergyLevel() {
    this.energyLevel++
    if(this.energyLevel > 9 && !this.hasFlashedThisRound) {
      this.flash()
    }
  }

  public flash() {
    this.hasFlashedThisRound = true
    this.neighbors.forEach(neighbor => neighbor.increaseEnergyLevel())
    flashCounter++
  }

  public endTimestep() {
    if(this.hasFlashedThisRound) {
      this.hasFlashedThisRound = false
      this.energyLevel = 0
    }
  }
}

const rows: number[][] = String(readFileSync('./input.txt')).split('\n').map(line => line.trim().split('').map(numStr => parseInt(numStr)))
const map: Map = new Map(rows)


if(RUN_SLOWLY) {
  let timestep = 1
  
  function runTimestep() {
    map.runTimestep()
    console.log(('' + timestep).padEnd(30, '='))
    console.log(map.toString())
    if(timestep < TOTAL_TIMESTEPS) {
      timestep++
      setTimeout(runTimestep, TIMEOUT)
    }
  }
  runTimestep()
  
  setTimeout(() => {
    console.log(`There were ${flashCounter} flashes!`)
  }, 100 * 100)
} 
else {
  for (let timestep = 1; timestep <= TOTAL_TIMESTEPS; timestep++) {
    map.runTimestep()
  }  
  console.log(`There were ${flashCounter} flashes!`)
}