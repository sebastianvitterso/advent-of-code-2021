import { readFileSync } from 'fs'

function isNumber(val: any): val is number {
  return +val === val
}

type PairArray = [ PairArray|number, PairArray|number ]

function isPairArray(val: any): val is PairArray {
  if(!Array.isArray(val) || val.length !== 2) return false
  const [x,y] = val
  return ( isNumber(x) || isPairArray(x) ) && ( isNumber(y) || isPairArray(y) )
}

function arrayifyPair(value: Pair): PairArray {
  return [
    isNumber(value.left) ? value.left : arrayifyPair(value.left), 
    isNumber(value.right) ? value.right : arrayifyPair(value.right)
  ]
}

type LeftOrRight = 'left'|'right'

class Pair {
  left: Pair|number
  right: Pair|number
  parent: Pair|null
  positionInParent: LeftOrRight|null
  depth: number

  constructor([left,right]: PairArray, parent: Pair|null = null, positionInParent: LeftOrRight|null = null, depth: number = 0) {
    this.parent = parent
    this.positionInParent = positionInParent
    this.depth = depth
    this.left = left instanceof Array ? new Pair(left, this, 'left', depth + 1) : left
    this.right = right instanceof Array ? new Pair(right, this, 'right', depth + 1) : right

    this.check()
  }

  private split(pos: LeftOrRight) {
    const oldVal = this[pos]
    if(!isNumber(oldVal)) throw "OUCH! Split-value isn't a number!"

    this[pos] = new Pair([ Math.floor(oldVal / 2), Math.ceil(oldVal / 2)   ])
  }

  add(pair: Pair): Pair {
    return new Pair([arrayifyPair(this), arrayifyPair(pair)])
  }

  explode(position: LeftOrRight) {
    const otherPosition = position === 'left' ? 'right' : 'left'
    const child = this[position]
    if(isNumber(child)) throw "Can't explode numerical children"
    if(!isNumber(child.left) || !isNumber(child.right)) throw "Can't explode children with non-numerical children!"

    if(isNumber(this[otherPosition])) {
      (this[otherPosition] as number) += (child[otherPosition] as number)
    } else {
      (this[otherPosition] as Pair).pushFromParent(child[otherPosition] as number, otherPosition)
    }
  }

  pushFromParent(value: number, direction: LeftOrRight) {
    
  }

  pushFromChild(value: number, position: LeftOrRight) {

  }

  // [[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]
  // [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]


  check(): void {
    if(this.depth >= 4) this.parent?.explode(this.positionInParent!)

    if(isNumber(this.left)) {
      if(this.left > 10) this.split('left')
    } else {
      this.left.check()
    }

    if(isNumber(this.right)) {
      if(this.right > 10) this.split('right')
    } else {
      this.right.check()
    }
  }
}

const pairArrays: PairArray[] = String(readFileSync('./input.txt')).split('\n').map(str => JSON.parse(str.trim())) as PairArray[]
const pairs: Pair[] = pairArrays.map(pairArray => new Pair(pairArray))
const arrayifiedPairs: PairArray[] = pairs.map(pair => arrayifyPair(pair))

console.log(JSON.stringify(arrayifiedPairs) === JSON.stringify(pairArrays))
