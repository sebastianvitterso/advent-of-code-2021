import { readFileSync } from 'fs'

const truthLUT: Record<number, string> = {
  0: 'abcefg',
  1: 'cf',
  2: 'acdeg',
  3: 'acdfg',
  4: 'bcdf',
  5: 'abdfg',
  6: 'abdefg',
  7: 'acf',
  8: 'abcdefg',
  9: 'abcdfg',
}

class Line {
  public signalPatterns: string[]
  public outputPatterns: string[]

  constructor(inputString: string) {
    [this.signalPatterns, this.outputPatterns] = inputString.split('|').map(str => str.trim()).map(str => str.split(' '))
  }

  public calculateSegmentMapping() {
    // first: Find 1, 4 and 7. 
    const jumbledLUT: Record<number, string> = {}
    for(const pattern of this.signalPatterns) {
      if(pattern.length === 2) {
        jumbledLUT[1] = pattern
      }
      if(pattern.length === 3) {
        jumbledLUT[7] = pattern
      }
      if(pattern.length === 4) {
        jumbledLUT[4] = pattern
      }
    }

    const fiveLetterPatterns = this.signalPatterns.filter(pattern => pattern.length === 5)
    const fiveLetterLetterCounts: Record<string, number> = {}
    for (const pattern of fiveLetterPatterns) {
      for (const character of pattern) {
        if(fiveLetterLetterCounts[character] === undefined) fiveLetterLetterCounts[character] = 0
        fiveLetterLetterCounts[character]++
      }
    }

    const sixLetterPatterns = this.signalPatterns.filter(pattern => pattern.length === 6)
    const sixLetterLetterCounts: Record<string, number> = {}
    for (const pattern of sixLetterPatterns) {
      for (const character of pattern) {
        if(sixLetterLetterCounts[character] === undefined) sixLetterLetterCounts[character] = 0
        sixLetterLetterCounts[character]++
      }
    }

    // mapping is from jumbled to correct segment
    const segmentMapping: Record<string, string> = {}
    segmentMapping.a = [...jumbledLUT[7]].find(char => !jumbledLUT[1].includes(char))!
    segmentMapping.f = [...sixLetterPatterns[0]].find(char => sixLetterLetterCounts[char] === 3 && jumbledLUT[1].includes(char))!
    segmentMapping.c = [...jumbledLUT[1]].find(char => char !== segmentMapping.f)!
    segmentMapping.d = [...jumbledLUT[4]].find(char => fiveLetterPatterns.every(pattern => pattern.includes(char)))!
    segmentMapping.b = [...jumbledLUT[4]].find(char => fiveLetterLetterCounts[char] === 1)!
    segmentMapping.g = [...fiveLetterPatterns[0]].find(char => fiveLetterLetterCounts[char] === 3 && char !== segmentMapping.a && char !== segmentMapping.d)!
    segmentMapping.e = [...'abcdefg'].find(char => !Object.values(segmentMapping).includes(char))!
    return segmentMapping
  }

  public calculatePatternLookup() {
    const segmentMapping = this.calculateSegmentMapping()
    return Object.fromEntries(
      Object.entries(truthLUT).map(([key, value]) => [
        key, 
        [...value].map(trueSegment => segmentMapping[trueSegment]).sort().join('')
      ])
    )
  }

  public decodeOutputPatterns() {
    const patternLookup = this.calculatePatternLookup()
    const outputNumbers: number[] = []
    for (const pattern of this.outputPatterns) {
      outputNumbers.push(
        parseInt(
          Object.entries(patternLookup)
          .map(([lookupValue, lookupPattern]) =>  ({lookupValue, lookupPattern}))
          .find(({lookupValue, lookupPattern}) => lookupPattern === [...pattern].sort().join(''))!
          .lookupValue
        )
      )
    }
    return parseInt(outputNumbers.join(''))
  }
}


const lines: Line[] = String(readFileSync('./input.txt')).split('\n').map(numStr => new Line(numStr.trim()))

console.log(lines.reduce((sum, line) => sum + line.decodeOutputPatterns(), 0))