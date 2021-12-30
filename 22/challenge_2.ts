import { readFileSync } from 'fs'

type Coordinate = {
  x: number,
  y: number,
  z: number,
}

type Axis = 'x'|'y'|'z'

type Plane = {
  axis: Axis,
  coordinate: number,
}

type Box = {
  xMinPlane: Plane
  xMaxPlane: Plane
  yMinPlane: Plane
  yMaxPlane: Plane
  zMinPlane: Plane
  zMaxPlane: Plane
}

function rangeStringToCoordinateRange(input: string): Box {
  const [ [xFrom, xTo], [yFrom, yTo], [zFrom, zTo] ] = input.split(',').map(longRange => longRange.split('=')[1].split('..').map(numStr => parseInt(numStr))) as [number, number][]
  return {
    xMinPlane: { axis: 'x', coordinate: xFrom - 0.5 },
    xMaxPlane: { axis: 'x', coordinate: xTo + 0.5 },
    yMinPlane: { axis: 'y', coordinate: yFrom - 0.5 },
    yMaxPlane: { axis: 'y', coordinate: yTo + 0.5 },
    zMinPlane: { axis: 'z', coordinate: zFrom - 0.5 },
    zMaxPlane: { axis: 'z', coordinate: zTo + 0.5 },
  }
}

function getAllPlanes(boxes: Box[]) {
  return boxes.reduce((allPlanes, currentBox) => [...allPlanes, ...Object.values(currentBox)] as Plane[], [] as Plane[])
}

function divideBoxByPlane(box: Box, plane: Plane): Box[] {
  const minAxisLabel = plane.axis + 'MinPlane' as 'xMinPlane'|'yMinPlane'|'zMinPlane'
  const maxAxisLabel = plane.axis + 'MaxPlane' as 'xMaxPlane'|'yMaxPlane'|'zMaxPlane'

  if(box[minAxisLabel].coordinate < plane.coordinate && box[maxAxisLabel].coordinate > plane.coordinate) {
    const lowerBox = { ...box, [maxAxisLabel]: plane }
    const upperBox = { ...box, [minAxisLabel]: plane }
    return [ lowerBox, upperBox ]
  } else {
    return [ box ]
  }
}

function divideBoxByPlanes(box: Box, planes: Plane[]) {
  let subBoxes: Box[] = [ box ]
  for (const plane of planes) {
    let previousBoxes = [ ...subBoxes ]
    subBoxes = []
    for (const previousBox of previousBoxes) {
      subBoxes.push(...divideBoxByPlane(previousBox, plane))
    }
  }
  return subBoxes
}

function boxIsCompletelyCoveredByBox(innerBox: Box, outerBox: Box) {
  return (outerBox.xMinPlane.coordinate <= innerBox.xMinPlane.coordinate)
      && (outerBox.xMaxPlane.coordinate >= innerBox.xMaxPlane.coordinate)
      && (outerBox.yMinPlane.coordinate <= innerBox.yMinPlane.coordinate)
      && (outerBox.yMaxPlane.coordinate >= innerBox.yMaxPlane.coordinate)
      && (outerBox.zMinPlane.coordinate <= innerBox.zMinPlane.coordinate)
      && (outerBox.zMaxPlane.coordinate >= innerBox.zMaxPlane.coordinate)
}

function boxesOverlap(boxA: Box, boxB: Box) {
  return boxIsCompletelyCoveredByBox(boxA, boxB) || getCorners(boxA).some(corner => coordinateIsInsideBox(corner, boxB))
}

function coordinateIsInsideBox(coordinate: Coordinate, box: Box) {
  return (box.xMinPlane.coordinate < coordinate.x)
      && (box.xMaxPlane.coordinate > coordinate.x)
      && (box.yMinPlane.coordinate < coordinate.y)
      && (box.yMaxPlane.coordinate > coordinate.y)
      && (box.zMinPlane.coordinate < coordinate.z)
      && (box.zMaxPlane.coordinate > coordinate.z)
}

function getCorners(box: Box): Coordinate[] {
  return [
    { x: box.xMinPlane.coordinate, y: box.yMinPlane.coordinate, z: box.zMinPlane.coordinate},
    { x: box.xMinPlane.coordinate, y: box.yMinPlane.coordinate, z: box.zMaxPlane.coordinate},
    { x: box.xMinPlane.coordinate, y: box.yMaxPlane.coordinate, z: box.zMinPlane.coordinate},
    { x: box.xMinPlane.coordinate, y: box.yMaxPlane.coordinate, z: box.zMaxPlane.coordinate},
    { x: box.xMaxPlane.coordinate, y: box.yMinPlane.coordinate, z: box.zMinPlane.coordinate},
    { x: box.xMaxPlane.coordinate, y: box.yMinPlane.coordinate, z: box.zMaxPlane.coordinate},
    { x: box.xMaxPlane.coordinate, y: box.yMaxPlane.coordinate, z: box.zMinPlane.coordinate},
    { x: box.xMaxPlane.coordinate, y: box.yMaxPlane.coordinate, z: box.zMaxPlane.coordinate},
  ]
}

function boxIsCoveredByBoxes(innerBox: Box, outerBoxes: Box[]) {
  return outerBoxes.some(outerBox => boxIsCompletelyCoveredByBox(innerBox, outerBox))
}

function getBoxSize(box: Box) {
  return (box.xMaxPlane.coordinate - box.xMinPlane.coordinate) * (box.yMaxPlane.coordinate - box.yMinPlane.coordinate) * (box.zMaxPlane.coordinate - box.zMinPlane.coordinate)
}

// const input = String(readFileSync('./test_input1.txt')) // 39
// const input = String(readFileSync('./test_input2.txt')) // 590784 
// const input = String(readFileSync('./test_input3.txt')) // 2758514936282235
const input = String(readFileSync('./input.txt'))
    .split('\n')
    .map(row => row.split(' '))
    .map(([onOff, range]) => [onOff === 'on', rangeStringToCoordinateRange(range)]) as [boolean, Box][]

let onBoxes: Box[] = []
let i = 0
for (const [turnOn, box] of input) {
  console.log(`\n\nTurn ${turnOn ? 'ON' : 'OFF'} [${++i}/${input.length}]`)
  if (turnOn) {
    // if no existing boxes overlap with this one:
    const overlappingOnBoxes = onBoxes.filter(onBox => boxesOverlap(onBox, box))
    if(overlappingOnBoxes.length === 0) {
      onBoxes.push(box)
    }
    else {
      console.log("overlappingOnBoxes", overlappingOnBoxes.length)
      const overlappingOnBoxPlanes = getAllPlanes(overlappingOnBoxes)
      console.log("overlappingBoxPlanes", overlappingOnBoxPlanes.length)
      const currentSubBoxes = divideBoxByPlanes(box, overlappingOnBoxPlanes)
      console.log("currentSubBoxes", currentSubBoxes.length)
      const newSubBoxes = currentSubBoxes.filter(subBox => !boxIsCoveredByBoxes(subBox, onBoxes))
      console.log("newSubBoxes", newSubBoxes.length)
      onBoxes.push(...newSubBoxes)
    }
  }
  else {
    const turnOffPlanes = Object.values(box)
    console.log("turnOffPlanes", turnOffPlanes.length)
    onBoxes = onBoxes.flatMap(onBox => divideBoxByPlanes(onBox, turnOffPlanes))
    console.log("onBoxes pre-filter:", onBoxes.length)
    onBoxes = onBoxes.filter(onBox => !boxIsCompletelyCoveredByBox(onBox, box))
  }
  console.log('onBoxes:', onBoxes.length)
  console.log('turned on voxels:', onBoxes.map(box => getBoxSize(box)).reduce((sum, curr) => sum + curr, 0))
}
console.log(onBoxes.map(box => getBoxSize(box)).reduce((sum, curr) => sum + curr, 0))

