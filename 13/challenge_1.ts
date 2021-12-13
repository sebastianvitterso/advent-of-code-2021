import { readFileSync, writeFileSync } from 'fs'

type Axis = 'x'|'y'

class Coordinate {
  x: number
  y: number

  constructor(line: string) {
    [this.x, this.y] = line.split(',').map(str => parseInt(str))
  }
}

class Fold {
  axis: Axis
  coordinate: number
  constructor(line: string) {
    const lastToken = line.split(' ')[2] // "fold along x=2".split(' ')[2] gives "x=2"
    const axis = lastToken.split('=')[0]
    if(axis !== 'x' && axis !== 'y') throw 'axis is not x or y'
    this.axis = axis
    this.coordinate = parseInt(lastToken.split('=')[1])
  }
}

class Paper {
  dots: boolean[][]

  constructor(coordinates: Coordinate[]) {
    const xMax = coordinates.reduce((max, curr) => Math.max(max, curr.x), 0)
    const yMax = coordinates.reduce((max, curr) => Math.max(max, curr.y), 0)

    this.dots = (new Array(yMax + 1)).fill(0).map(_ => (new Array(xMax + 1)).fill(false))
    for(const coordinate of coordinates) {
      this.dots[coordinate.y][coordinate.x] = true
    }
  }
  
  fold(fold: Fold): void {
    let newDots: boolean[][]
    if(fold.axis === 'x') {
      const leftDots = this.dots.map(row => row.filter((dot, index) => index < fold.coordinate))
      const rightDotsReversed = this.dots.map(row => row.filter((dot, index) => index > fold.coordinate).reverse())
      newDots = [...leftDots]
      for(const [rowIndex, row] of rightDotsReversed.entries()) {
        for(const [dotIndex, dot] of row.entries()) {
          newDots[rowIndex][dotIndex] = newDots[rowIndex][dotIndex] || dot
        }
      }
    }
    else {
      const bottomDots = this.dots.filter((row, index) => index < fold.coordinate)
      const topDotsReversed = this.dots.filter((row, index) => index > fold.coordinate).reverse()
      newDots = [...bottomDots]
      for(const [rowIndex, row] of topDotsReversed.entries()) {
        for(const [dotIndex, dot] of row.entries()) {
          newDots[rowIndex][dotIndex] = newDots[rowIndex][dotIndex] || dot
        }
      }
    }
    this.dots = newDots
  }

  writeToFile(): void {
    const outputString = this.dots.map(row => row.map(dot => dot ? '#' : ' ').join('')).join('\n')
    writeFileSync('./output.txt', outputString)  
  }

  getTrueCount(): number {
    return this.dots.reduce((outerSum, row) => outerSum + row.reduce((innerSum, dot) => dot ? innerSum + 1 : innerSum, 0), 0)
  }
}

const lines: string[] = String(readFileSync('./input.txt')).split('\n').map(line => line.trim())
const coordinates = lines.filter(line => /^\d+,\d+$/.test(line)).map(line => new Coordinate(line))
const folds = lines.filter(line => /^fold along [xy]=\d+$/.test(line)).map(line => new Fold(line))
const paper = new Paper(coordinates)

for(const fold of folds) {
  paper.fold(fold)
  console.log(paper.getTrueCount())
}

paper.writeToFile()
