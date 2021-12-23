import {} from 'fs'

let playerCounter = 1

class Player {
  position: number
  id: number
  score: number = 0

  constructor(position: number) {
    this.position = position
    this.id = playerCounter++
  }

  move(steps: number) {
    this.position = (((this.position + steps) - 1) % 10) + 1
    this.score += this.position
  }
}

abstract class Die {
  abstract roll(): number
}

class DeterministicDie extends Die {
  nextNumber: number = 1
  rollCounter = 0

  roll(): number {
    this.rollCounter++
    console.log(this.rollCounter)
    const rolledNumber = this.nextNumber
    this.nextNumber = (((this.nextNumber + 1) - 1) % 100) + 1
    return rolledNumber
  }
}

const player1 = new Player(9)
const player2 = new Player(3)
const die = new DeterministicDie()
const players = [player1, player2]

while(true) {
  for(const player of players) {
    player.move(die.roll() + die.roll() + die.roll())
    if(player.score >= 1000) {
      console.log(`PLAYER ${player.id} WINS!`)
      const otherPlayer = players.find(p => p.id !== player.id)!
      console.log(player.id, otherPlayer.id)
      console.log(otherPlayer.score, die.rollCounter, die.rollCounter * otherPlayer.score)
      process.exit()
    }
  }
}
