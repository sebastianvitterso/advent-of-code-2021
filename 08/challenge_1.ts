import { readFileSync } from 'fs'

class Line {
  public signalPatterns: string[]
  public outputPatterns: string[]

  constructor(inputString: string) {
    [this.signalPatterns, this.outputPatterns] = inputString.split('|').map(str => str.trim()).map(str => str.split(' '))
  }

  public countOneFourSevenEight() {
    return this.outputPatterns.reduce((ctr, pattern) => [2,3,4,7].includes(pattern.length) ? ctr + 1 : ctr, 0)
  }
}

const lines: Line[] = String(readFileSync('./input.txt')).split('\n').map(numStr => new Line(numStr.trim()))

const oneFourSevenEightCount = lines.reduce((ctr, line) => ctr + line.countOneFourSevenEight(), 0)
console.log(oneFourSevenEightCount)