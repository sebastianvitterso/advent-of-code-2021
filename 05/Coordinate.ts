export default class Coordinate {
  constructor(
    public x: number,
    public y: number,
  ){}

  static fromString(string: string): Coordinate {
    const [x,y] = string.split(',').map(str => parseInt(str))
    return new Coordinate(x,y)
  }

  public toString() : string {
    return `(${this.x}, ${this.y})`
  }
}