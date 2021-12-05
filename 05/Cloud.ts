import Coordinate from "./Coordinate"

export default class Cloud {
  constructor(
    public from: Coordinate,
    public to: Coordinate,
  ){}
  
  public getAffectedCoordinates() {
    const affectedCoordinates: Coordinate[] = []
    const xDiff = this.to.x - this.from.x
    const yDiff = this.to.y - this.from.y

    let x = this.from.x
    let y = this.from.y

    while(true) {
      affectedCoordinates.push(new Coordinate(x,y))
      if(x === this.to.x && y === this.to.y) {
        return affectedCoordinates
      }
      x += Math.sign(xDiff)
      y += Math.sign(yDiff)
    }
  }

  public isDiagonal() {
    return (this.from.x !== this.to.x) && (this.from.y !== this.to.y)
  }
  
  static fromInputLine(inputLine: string): Cloud {
    const [fromCoord, toCoord] = inputLine.split(' -> ').map(Coordinate.fromString)
    return new Cloud(fromCoord, toCoord)
  }
}
