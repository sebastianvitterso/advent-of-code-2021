import { readFileSync } from 'fs'


type Pair = [ Pair|number, Pair|number ]

function isPair(val: any): val is Pair {
  if(!Array.isArray(val) || val.length !== 2) return false
  const [x,y] = val
  return ( isNumber(x) || isPair(x) ) && ( isNumber(y) || isPair(y) )
}

function isNumber(val: any): val is number {
  return +val === val
}

function addPairArrays(pairArrayA: Pair, pairArrayB: Pair): Pair {
  return [pairArrayA, pairArrayB]
}

function isOk([x,y]: Pair): boolean {
  return ( ( isNumber(x) && x < 10 ) || ( isPair(x) && isOk(x) ) ) && ( ( isNumber(y) && y < 10 ) || ( isPair(y) && isOk(y) ) )
}

function getMaxDepth(val: Pair|number, ): number {
  if(isNumber(val)) return 0
  const [x,y] = val
  return Math.max(getMaxDepth(x), getMaxDepth(y)) + 1
}


const pairs: Pair[] = String(readFileSync('./input.txt')).split('\n').map(str => JSON.parse(str.trim())) as Pair[]

let pair = pairs.shift()!

while(pairs.length > 0) {
  pair = addPairArrays(pair, pairs.shift()!)
  console.log(pairs.length, getMaxDepth(pair))
  if(!isOk(pair)) {
  }
}
