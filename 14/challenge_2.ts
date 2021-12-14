import { readFileSync } from 'fs'

type Rule = {
  double: string,
  insert: string,
}

class DoubleCounter {
  counter: Record<string, number> = {}

  addFromRule(rule: Rule, count: number) {
    this.addDouble(rule.double[0] + rule.insert, count)
    this.addDouble(rule.insert + rule.double[1], count)
  }

  addDouble(double: string, count: number) {
    if(!this.counter[double]) this.counter[double] = 0
    this.counter[double] += count
  }
}

const lines: string[] = String(readFileSync('./input.txt')).split('\n').map(line => line.trim())
const startPattern: string = lines[0]
const rules: Rule[] = lines.slice(2).map(line => ({ double: line.slice(0,2), insert: line[6] }))

const ITERATIONS = 40

// A double is a two-character sequence.
let doubleCounter = new DoubleCounter

for (let i = 0; i < startPattern.length - 1; i++) {
  doubleCounter.addDouble(startPattern.slice(i, i+2), 1)
}

for (let i = 1; i <= ITERATIONS; i++) {
  const newDoubleCounter = new DoubleCounter
  for (const [double, count] of Object.entries(doubleCounter.counter)) {
    const matchingRule = rules.find(rule => rule.double === double)
    if(matchingRule !== undefined) {
      newDoubleCounter.addFromRule(matchingRule, count)
    }
  }
  doubleCounter = newDoubleCounter
}

const firstChar = startPattern[0]
const lastChar = startPattern[startPattern.length - 1]

const charCounter: Record<string, number> = {[firstChar]: 0.5, [lastChar]: 0.5}
for (const [double, count] of Object.entries(doubleCounter.counter)) {
  for(const char of double.split('')) {
    if(!charCounter[char]) charCounter[char] = 0
    charCounter[char] += (count * 0.5)
  }
}


console.log(charCounter)

type CharCount = {
  char: string,
  count: number
}

let mostCommonChar: CharCount = { char: '_', count: -Infinity}
let leastCommonChar: CharCount = { char: '_', count: Infinity}

for(const [char, count] of Object.entries(charCounter)) {
  if(count > mostCommonChar.count) mostCommonChar = { char, count }
  if(count < leastCommonChar.count) leastCommonChar = { char, count }
}

console.log(mostCommonChar, leastCommonChar)
console.log(mostCommonChar.count - leastCommonChar.count)