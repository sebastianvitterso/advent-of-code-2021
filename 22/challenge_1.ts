import { readFileSync } from 'fs'

type Coordinate = {
  x: number,
  y: number,
  z: number,
}

type CoordinateRange = {
  from: Coordinate,
  to: Coordinate,
}

function getCoordinateString(x: number, y: number, z: number) {
  return [x,y,z].join(',')
}

function getSize(range: CoordinateRange) {
  return (range.to.x - range.from.x + 1) * (range.to.y - range.from.y + 1) * (range.to.z - range.from.z + 1)
}

function truncate(value: number) {
  return Math.min(50, Math.max(-50, value))
}

function truncateOrNullify(range: CoordinateRange): CoordinateRange|null {
  if ((range.from.x < -50 && range.to.x > 50) || (range.from.y < -50 && range.to.y > 50) || (range.from.z < -50 && range.to.z > 50)) {
    return null
  }

  return {
    from: { x: Math.max(range.from.x, -50), y: Math.max(range.from.y, -50), z: Math.max(range.from.z, -50)},
    to: { x: Math.min(range.to.x, 50), y: Math.min(range.to.y, 50), z: Math.min(range.to.z, 50)},
  }
}

function rangeStringToCoordinateRange(input: string): CoordinateRange {
  const [ xFromTo, yFromTo, zFromTo ] = input.split(',').map(longRange => longRange.split('=')[1].split('..').map(numStr => parseInt(numStr))) as [number, number][]
  const fromCoordinate = { x: xFromTo[0], y: yFromTo[0], z: zFromTo[0] }
  const toCoordinate = { x: xFromTo[1], y: yFromTo[1], z: zFromTo[1] }
  return { from: fromCoordinate, to: toCoordinate }
}

const input = String(readFileSync('./input.txt'))
    .split('\n')
    .map(row => row.split(' '))
    .map(([onOff, range]) => [onOff === 'on', truncateOrNullify(rangeStringToCoordinateRange(range))])
    .filter(([_turnOn, rangeOrNull]) => rangeOrNull !== null) as [boolean, CoordinateRange][]


const cuboid: Record<string, boolean> = {}

for (const [turnOn, range] of input) {
  for (let x = range.from.x; x <= range.to.x; x++) {
    for (let y = range.from.y; y <= range.to.y; y++) {
      for (let z = range.from.z; z <= range.to.z; z++) {
        if (turnOn) cuboid[getCoordinateString(x,y,z)] = true
        else delete cuboid[getCoordinateString(x,y,z)]
      }
    }
  }
  console.log(Object.keys(cuboid).length)
}
