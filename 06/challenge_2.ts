import { readFileSync } from 'fs'

// turns out our answer is in the ~2^48=281 474 976 710 656 range, so 

const initialFishCountdowns: number[] = String(readFileSync('./input.txt')).split(',').map(numStr => parseInt(numStr))

const daysLeftArray = Array(9).fill(0)
for (const number of initialFishCountdowns) {
  daysLeftArray[number]++
}

const NUMBER_OF_DAYS_TO_SIMULATE = 256

for (let i = 1; i <= NUMBER_OF_DAYS_TO_SIMULATE; i++) {
  const givingBirthTodayCount = daysLeftArray.shift()
  daysLeftArray[6] += givingBirthTodayCount
  daysLeftArray.push(givingBirthTodayCount)
  const sum = daysLeftArray.reduce((sum, currentVal) => sum + currentVal, 0)
  console.log(`Number of fish after day ${i}: ${sum}`)
}

// Wacko task, love it.
