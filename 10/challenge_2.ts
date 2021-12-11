import { readFileSync } from 'fs'

const rows: string[][] = String(readFileSync('./input.txt')).split('\n').map(line => line.trim().split(''))

const openers = ['(','[','{','<']
const closers = [')',']','}','>']

const completionBaseScores: Record<string, number> = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

class CorruptedError extends Error {}
let completionScores: number[] = []

for (const row of rows) {
  try {
    const parsedRow = []
    for (const char of row) {
      if(openers.indexOf(char) !== -1) { // is an opener
        parsedRow.push(char)
      }
      else { // is a closer
        const matchingOpener = openers[closers.indexOf(char)]
        
        if(parsedRow[parsedRow.length - 1] === matchingOpener) {
          parsedRow.pop()
        } else {
          throw new CorruptedError(char)
        }
      }
    }
    // if we've come this far, the row is incomplete and not corrupted
    let completionScore = 0
    let completionString = []
    for(const [index, char] of [...parsedRow].reverse().entries()) {
      completionScore *= 5
      console.log(`${char} - ScoreA: ${completionScore}`)
      const matchingCloser = closers[openers.indexOf(char)]
      completionString.push(matchingCloser)
      completionScore += completionBaseScores[matchingCloser]
      console.log(`${char} - ScoreB: ${completionScore}`)
    }
    completionScores.push(completionScore)


  } catch(e) {
    if(e instanceof CorruptedError) continue
    else throw e
  }
}

completionScores.sort((a,b) => a-b)
console.log(completionScores)
console.log(completionScores[completionScores.length / 2 | 0])