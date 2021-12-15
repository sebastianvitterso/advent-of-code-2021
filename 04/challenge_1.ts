import { readFileSync } from 'fs'
import Board from './Board'

const lines = String(readFileSync('./input.txt')).split('\n').map(line => line.trim())
const numbers = lines.shift()!.split(',').map(txt => Number.parseInt(txt))

const boardArrays: number[][][] = []
for(const [i, line] of lines.entries()) {
  if(i % 6 == 0) {
    boardArrays.push([])
    continue
  }

  const lineNumbers = line.split(' ').filter(item => item.length > 0).map(txt => Number.parseInt(txt))
  boardArrays[boardArrays.length - 1]?.push(lineNumbers)
}

const boards: Board[] = boardArrays.map(boardArray => new Board(boardArray))

for (const [numberIndex, number] of numbers.entries()) {
  for (const board of boards) {
    board.giveNumber(number)
    if(board.hasWon()) {
      console.log(`Board ${board.id} has won, when given the number ${number} (#${numberIndex}), with a score of ${board.getScore(number)}`)
      process.exit()
    }
  }
}