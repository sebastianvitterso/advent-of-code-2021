import { readFileSync } from 'fs'

class Ocean {
  public fishes: Fish[]
  constructor(fishAgeList: string) {
    this.fishes = fishAgeList.split(',').map(age => new Fish(parseInt(age), this))
  }

  public addFish() {
    this.fishes.push(new Fish(Fish.FIRST_BIRTH_CYCLE, this))
  }

  public addDay() {
    this.fishes.forEach(fish => fish.addDay())
  }
}

class Fish {
  public static FIRST_BIRTH_CYCLE = 2
  public static BIRTH_CYCLE = 2

  constructor(public daysLeft: number, public ocean: Ocean) {}
  
  public addDay() {
    this.daysLeft = (this.daysLeft - 1)
    if(this.daysLeft < 0) {
      this.daysLeft = Fish.BIRTH_CYCLE
      this.ocean.addFish()
    }
  }
}

// The Object-oriented approach failed me today due to memory problems.

// const ocean = new Ocean(String(readFileSync('./input.txt')))
// const NUMBER_OF_DAYS_TO_SIMULATE = 80
// console.log(`Initial ocean size: ${ocean.fishes.length}`)
// for (let day = 0; day < 80; day++) {
//   ocean.addDay()
//   console.log(`Ocean size after ${day} days: ${ocean.fishes.length}`)
// }


// Let's try the scripty approach.

const numbers: number[] = String(readFileSync('./input.txt')).split(',').map(numStr => parseInt(numStr))

for (let i = 0; i < 80; i++) {
  console.log(`Day ${i}: ${numbers.length}`)
  for (let j = 0; j < numbers.length; j++) {
    if(numbers[j] === 0) {
      numbers.push(8 + 1)
      numbers[j] = 6 + 1
    }
    numbers[j]--
  }
}

console.log(`Day 80: ${numbers.length}`)
