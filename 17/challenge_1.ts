import {} from 'fs'
//input: target area: x=287..309, y=-76..-48

class Coordinate {
  constructor(public x: number, public y: number) {}

  addVelocity(velocity: Velocity) {
    this.x += velocity.x
    this.y += velocity.y
  }

  toString(): string {
    return `(${this.x},${this.y})`
  }
}

class Velocity {
  constructor(public x: number, public y: number) {}

  fade() {
    if(this.x > 0) this.x--
    if(this.x < 0) this.x++
    this.y--
  }
}

class Area {
  constructor(public minCoordinate: Coordinate, public maxCoordinate: Coordinate) {}

  contains(coordinate: Coordinate): boolean {
    return (
      this.minCoordinate.x <= coordinate.x
      && this.minCoordinate.y <= coordinate.y
      && this.maxCoordinate.x >= coordinate.x
      && this.maxCoordinate.y >= coordinate.y
    )
  }

  isAbove(coordinate: Coordinate): boolean {
    return this.minCoordinate.y > coordinate.y
  }
}


class Probe {
  position: Coordinate
  velocity: Velocity
  path: Coordinate[] = []

  constructor(startingPosition: Coordinate, startingVelocity: Velocity) {
    this.position = startingPosition
    this.velocity = startingVelocity
  }

  runStep() {
    this.path.push(new Coordinate(this.position.x, this.position.y))
    this.position.addVelocity(this.velocity)
    this.velocity.fade()
  }
}

const targetArea = new Area(new Coordinate(287, -76), new Coordinate(309, -48))
let maxY = -Infinity


for (let x = 20; x < 50; x++) {
  console.log(`x: ${x}`)
  for (let y = 0; y < 1000; y++) {
    const probe = new Probe(
      new Coordinate(0,0),
      new Velocity(x,y),
    )
    let localMaxY = -Infinity
    while(true) {
      // console.log(`Probe's position: ${probe.position}`)
      localMaxY = Math.max(probe.position.y, localMaxY)
      probe.runStep()
      if(targetArea.contains(probe.position)) {
        console.log(probe.path)
        console.log(`WOO, we're within!`)
        maxY = Math.max(maxY, localMaxY)
      }
      if(targetArea.isAbove(probe.position)) {
        // console.log(`Aw shucks, we missed.`)
        break
      }
    }
  }
}

console.log(maxY)
