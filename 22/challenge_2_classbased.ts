import { readFileSync } from 'fs'

type Coordinate = {
  x: number,
  y: number,
  z: number,
}

type Axis = 'x'|'y'|'z'

class Plane {
  axis: Axis
  coordinate: number

  constructor(axis: Axis, coordinate: number) {
    this.axis = axis
    this.coordinate = coordinate
  }
}

class Box {
  constructor(
    public xMinPlane: Plane,
    public xMaxPlane: Plane,
    public yMinPlane: Plane,
    public yMaxPlane: Plane,
    public zMinPlane: Plane,
    public zMaxPlane: Plane
  ) {}

  static fromRangeString(inputLine: string) {
    const [ [xFrom, xTo], [yFrom, yTo], [zFrom, zTo] ] = inputLine.split(',').map(longRange => longRange.split('=')[1].split('..').map(numStr => parseInt(numStr))) as [number, number][]
    return new Box(
      new Plane('x', xFrom - 0.5),  // xMinPlane
      new Plane('x', xTo   + 0.5),  // xMaxPlane
      new Plane('y', yFrom - 0.5),  // yMinPlane
      new Plane('y', yTo   + 0.5),  // yMaxPlane
      new Plane('z', zFrom - 0.5),  // zMinPlane
      new Plane('z', zTo   + 0.5),  // zMaxPlane
    )
  }

  getPlanes() {
    return [ this.xMinPlane, this.xMaxPlane, this.yMinPlane, this.yMaxPlane, this.zMinPlane, this.zMaxPlane ]
  }

  getSize() {
    return (this.xMaxPlane.coordinate - this.xMinPlane.coordinate) * (this.yMaxPlane.coordinate - this.yMinPlane.coordinate) * (this.zMaxPlane.coordinate - this.zMinPlane.coordinate)
  }

  containsBox(box: Box) {
    return (this.xMinPlane.coordinate <= box.xMinPlane.coordinate)
        && (this.xMaxPlane.coordinate >= box.xMaxPlane.coordinate)
        && (this.yMinPlane.coordinate <= box.yMinPlane.coordinate)
        && (this.yMaxPlane.coordinate >= box.yMaxPlane.coordinate)
        && (this.zMinPlane.coordinate <= box.zMinPlane.coordinate)
        && (this.zMaxPlane.coordinate >= box.zMaxPlane.coordinate)
  }

  containsCoordinate(coordinate: Coordinate) {
    return (this.xMinPlane.coordinate < coordinate.x)
        && (this.xMaxPlane.coordinate > coordinate.x)
        && (this.yMinPlane.coordinate < coordinate.y)
        && (this.yMaxPlane.coordinate > coordinate.y)
        && (this.zMinPlane.coordinate < coordinate.z)
        && (this.zMaxPlane.coordinate > coordinate.z)
  }

  overlaps(box: Box) {
    return this.containsBox(box) 
        || box.containsBox(this) 
        || this.getCorners().some(corner => this.containsCoordinate(corner))
  }

  getCorners(): Coordinate[] {
    return [
      { x: this.xMinPlane.coordinate, y: this.yMinPlane.coordinate, z: this.zMinPlane.coordinate},
      { x: this.xMinPlane.coordinate, y: this.yMinPlane.coordinate, z: this.zMaxPlane.coordinate},
      { x: this.xMinPlane.coordinate, y: this.yMaxPlane.coordinate, z: this.zMinPlane.coordinate},
      { x: this.xMinPlane.coordinate, y: this.yMaxPlane.coordinate, z: this.zMaxPlane.coordinate},
      { x: this.xMaxPlane.coordinate, y: this.yMinPlane.coordinate, z: this.zMinPlane.coordinate},
      { x: this.xMaxPlane.coordinate, y: this.yMinPlane.coordinate, z: this.zMaxPlane.coordinate},
      { x: this.xMaxPlane.coordinate, y: this.yMaxPlane.coordinate, z: this.zMinPlane.coordinate},
      { x: this.xMaxPlane.coordinate, y: this.yMaxPlane.coordinate, z: this.zMaxPlane.coordinate},
    ]
  }

  clone(): Box {
    return new Box(this.xMinPlane, this.xMaxPlane, this.yMinPlane, this.yMaxPlane, this.zMinPlane, this.zMaxPlane)
  }

  splitByPlane(plane: Plane): Box[] {
    const minAxisLabel = plane.axis + 'MinPlane' as 'xMinPlane'|'yMinPlane'|'zMinPlane'
    const maxAxisLabel = plane.axis + 'MaxPlane' as 'xMaxPlane'|'yMaxPlane'|'zMaxPlane'
  
    if(this[minAxisLabel].coordinate < plane.coordinate && this[maxAxisLabel].coordinate > plane.coordinate) {
      const lowerBox = this.clone()
      const upperBox = this.clone()
      lowerBox[maxAxisLabel] = plane
      upperBox[minAxisLabel] = plane
      return [ lowerBox, upperBox ]
    } else {
      return [ this ]
    }
  }
}

function divideBoxByPlanes(box: Box, planes: Plane[]) {
  let subBoxes: Box[] = [ box ]
  for (const plane of planes) {
    let previousBoxes = [ ...subBoxes ]
    subBoxes = []
    for (const previousBox of previousBoxes) {
      subBoxes.push(...previousBox.splitByPlane(plane))
    }
  }
  return subBoxes
}

const input = String(readFileSync('./test_input1.txt')) // 39
// const input = String(readFileSync('./test_input2.txt')) // 590784 
// const input = String(readFileSync('./test_input3.txt')) // 2758514936282235
// const input = String(readFileSync('./input.txt'))
    .split('\n')
    .map(row => row.split(' '))
    .map(([onOff, range]) => [onOff === 'on', Box.fromRangeString(range)]) as [boolean, Box][]

console.log('\n'.repeat(20))
let onBoxes: Box[] = []
let i = 0
for (const [turnOn, box] of input) {
  console.log(`\n${turnOn ? 'ON' : 'OFF'} [${++i}/${input.length}]`)
  if (turnOn) {
    // if no existing boxes overlap with this one:
    const overlappingOnBoxes = onBoxes.filter(onBox => onBox.overlaps(box))
    console.log('overlappingOnBoxes:', overlappingOnBoxes.length)
    if(overlappingOnBoxes.length === 0) {
      onBoxes.push(box)
    }
    else {
      const overlappingOnBoxPlanes = overlappingOnBoxes.flatMap(box => box.getPlanes())
      const currentSubBoxes = divideBoxByPlanes(box, overlappingOnBoxPlanes)
      const newSubBoxes = currentSubBoxes.filter(subBox => !onBoxes.some(onBox => onBox.overlaps(subBox)))
      onBoxes.push(...newSubBoxes)
    }
  }
  else {
    const turnOffPlanes = Object.values(box)
    onBoxes = onBoxes.flatMap(onBox => divideBoxByPlanes(onBox, turnOffPlanes))
    onBoxes = onBoxes.filter(onBox => !onBox.overlaps(box))
  }
  // console.log('onBoxes:', onBoxes)
  console.log('turned on voxels:', onBoxes.map(box => box.getSize()).reduce((sum, curr) => sum + curr, 0))
}

