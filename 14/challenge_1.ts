import { readFileSync } from 'fs'

type Rule = {
  start: string,
  end: string,
  insert: string,
}

const lines: string[] = String(readFileSync('./input.txt')).split('\n').map(line => line.trim())
const startPattern: string = lines[0]
const rules: Rule[] = lines.slice(2).map(line => ({ start: line[0], end: line[1], insert: line[6] }))

const ITERATIONS = 10

let pattern: string[] = startPattern.split('')
for (let i = 1; i <= ITERATIONS; i++) {
  for (let i = pattern.length - 1; i >= 1; i--) {
    const endLetter = pattern[i]
    const startLetter = pattern[i-1]
    const matchingRule = rules.find(rule => rule.start === startLetter && rule.end === endLetter)
    if(matchingRule) {
      pattern.splice(i, 0, matchingRule.insert)
    }
  }
}

let charCounts: Record<string, number> = {}
for(const char of pattern) {
  if(!charCounts[char]) charCounts[char] = 0
  charCounts[char]++
}

type CharCount = {
  char: string,
  count: number
}

let mostCommonChar: CharCount = { char: '_', count: -Infinity}
let leastCommonChar: CharCount = { char: '_', count: Infinity}

for(const [char, count] of Object.entries(charCounts)) {
  if(count > mostCommonChar.count) mostCommonChar = { char, count }
  if(count < leastCommonChar.count) leastCommonChar = { char, count }
}

console.log(mostCommonChar, leastCommonChar)
console.log(mostCommonChar.count - leastCommonChar.count)