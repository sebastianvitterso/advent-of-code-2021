import Cloud from "./Cloud"

export default class Map {
  public readonly clouds: Cloud[]
  public readonly map: number[][]

  constructor(clouds: Cloud[]) {
    this.clouds = clouds
    const coordinateMaxes = {x: 0, y: 0}
    for(const cloud of this.clouds) {
      for(const coordinate of [cloud.from, cloud.to]) {
        coordinateMaxes.x = Math.max(coordinateMaxes.x, coordinate.x)
        coordinateMaxes.y = Math.max(coordinateMaxes.y, coordinate.y)
      }
    }
    // initialize the map as an array of y+1 arrays, where each of these contains x+1 zeros
    this.map = new Array(coordinateMaxes.y + 1).fill(0).map(_ => Array(coordinateMaxes.x + 1).fill(0))
    
    for (const cloud of clouds) {
      for (const coordinate of cloud.getAffectedCoordinates()) {
        this.map[coordinate.y][coordinate.x] += 1
      }
    }
  }
  
  public getIntersectionCount(): number {
    let intersectionCount = 0
    for(const row of this.map) {
      for(const value of row) {
        if(value >= 2) {
          intersectionCount++
        }
      }
    }
    return intersectionCount
  }
  
  static fromInputLines(inputLines: string[], skipDiagonalClouds: boolean): Map {
    const clouds = inputLines.map(inputLine => Cloud.fromInputLine(inputLine))
    if(skipDiagonalClouds) {
      return new Map(clouds.filter(cloud => !cloud.isDiagonal()))
    }
    return new Map(clouds)
  }
}