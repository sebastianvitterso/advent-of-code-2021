import {} from 'fs'

const tripleDistribution: Record<number, number> = {
  3: 1,
  4: 3,
  5: 6, 
  6: 7,
  7: 6,
  8: 3,
  9: 1,
}


class Position {
  nextPlayer: 0|1
  winner: 0|1|null = null
  scores: [number, number]
  positions: [number, number]
  count: number
  subPositions: Position[]|null = null
  depth: number

  constructor( nextPlayer: 0|1, scores: [number, number], positions: [number, number], count: number, depth: number) {
    this.nextPlayer = nextPlayer
    this.scores = scores
    this.positions = positions
    this.count = count
    this.depth = depth
    if(this.someoneHasWon()) {
      this.winner = this.getWinner()
    }
  }

  public calculateSubpositions(): Position[]|null {
    if(this.someoneHasWon()) return null

    return Object.entries(tripleDistribution)
      .map(([key, value]) => [parseInt(key), value])
      .map(([distance, count]) => {
        const currentPlayer = this.nextPlayer // we're now in the "next" round
        const nextPlayer = (currentPlayer + 1) % 2 as 1|0

        const positions = [...this.positions]  as [number, number]
        positions[currentPlayer] = (((positions[currentPlayer] + distance) - 1) % 10) + 1

        const scores = [...this.scores] as [number, number]
        scores[currentPlayer] += positions[currentPlayer]

        const newCount = this.count * count

        return new Position(nextPlayer, scores, positions, newCount, this.depth + 1)
      })
  }

  public someoneHasWon(): boolean {
    return this.scores.some(score => score >= 21)
  }

  public getWinner(): 0|1|null {
    const winner = this.scores.findIndex(score => score >= 21) as -1|0|1
    return winner !== -1 ? winner : null
  }

}


const startPosition = new Position(0, [0,0], [9,3], 1, 0)

const positions: Position[] = [startPosition]

let counter = 0
const wins = [0,0]

while(positions.length > 0) {
  const position = positions.pop()!
  if(position.someoneHasWon()) {
    wins[position.winner!] += position.count
    if(++counter % 1_000_000 == 0) {
      console.log(`THE WINNER IS: ${position.winner} WITH ${position.scores[position.winner!]}. [depth: ${position.depth}, counter: ${counter}, winscores: ${wins}]`)
    }
    continue
  }

  positions.push(...position.calculateSubpositions()!)
} 

console.log(wins)

const winner = wins[0] > wins[1] ? 0 : 1

console.log(`Winner is ${winner} with ${wins[winner]}`)