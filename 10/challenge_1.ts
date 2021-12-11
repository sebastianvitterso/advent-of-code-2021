import { readFileSync } from 'fs'

const rows: string[][] = String(readFileSync('./input.txt')).split('\n').map(line => line.trim().split(''))

const openers = ['(','[','{','<']
const closers = [')',']','}','>']

const syntaxErrorScores: Record<string, number> = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

class CorruptedError extends Error {}
let corruptedScore = 0

for (const row of rows) {
  try {
    const parsedRow = []
    for (const char of row) {
      if(openers.indexOf(char) !== -1) { // if is opener
        parsedRow.push(char)
      }
      else { // else is closer
        const matchingOpener = openers[closers.indexOf(char)]
        if(parsedRow[parsedRow.length - 1] === matchingOpener) {
          parsedRow.pop()
        } else {
          throw new CorruptedError(char)
        }
      }
    }
  } catch(e) {
    if(e instanceof CorruptedError) {
      const corruptedChar = e.message
      corruptedScore += syntaxErrorScores[corruptedChar]
    } else {
      throw e
    }
  }
}

console.log(corruptedScore)