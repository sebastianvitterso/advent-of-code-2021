import { readFileSync } from 'fs'

type Pixel = '#'|'.'

const lines: String[] = String(readFileSync('./input.txt')).split('\n').map(line => line.trim())

const algortihm: String = lines[0]
let image: Pixel[][] = lines.slice(2).map(line => line.split('')) as Pixel[][]

const NUMBER_OF_ITERATIONS = 50

function padImage(image: Pixel[][], padding: number): void {
  for (let i = 0; i < padding; i++) {
    image.unshift(image[0].map(_ => '.'))
    image.push(image[0].map(_ => '.'))
    for(const row of image) {
      row.unshift('.')
      row.push('.')
    }
  }
}

function unpadImage(image: Pixel[][], unpadding: number): void {
  for (let i = 0; i < unpadding; i++) {
    image.shift()
    image.pop()
    for(const row of image) {
      row.shift()
      row.pop()
    }
  }
}

function getValue3x3(image: Pixel[][], centerX: number, centerY: number): number {
  let numString = ''
  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 3; dx++) {
      const y = centerY + dy
      const x = centerX + dx
      const symbol: Pixel = image[y]?.[x] ?? '.'
      numString += symbol === '#' ? '1' : '0'
    }
  }

  return parseInt(numString, 2)
}

function countHashtags(image: Pixel[][]) {
  return image.reduce((count, currentRow) => count + currentRow.reduce((innerCount, pixel) => pixel === '#' ? innerCount + 1 : innerCount, 0), 0)
}

padImage(image, NUMBER_OF_ITERATIONS * 2 * 2)

console.log(countHashtags(image))
// console.log(image.map(row => row.join(' ')).join('\n') + '\n')

for (let i = 0; i < NUMBER_OF_ITERATIONS; i++) {
  const newImage = image.map(row => row.map(char => '.')) as Pixel[][]
  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image[0].length; x++) {
      const value3x3 = getValue3x3(image, x, y)
      const newValue = algortihm[value3x3]
      newImage[y][x] = newValue as Pixel
    }
  }
  image = newImage
}

unpadImage(image, NUMBER_OF_ITERATIONS * 2)

console.log(countHashtags(image))
  // console.log(image.map(row => row.join(' ')).join('\n') + '\n')
