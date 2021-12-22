import { readFileSync } from 'fs'

class StringStream {
  bits: string
  length: number
  constructor(bits: string) {
    this.bits = bits
    this.length = this.bits.length
  }

  shift(number: number = 1) {
    if(number > this.length) throw new Error("End of stream!")
    const toBeShifted = this.bits.slice(0,number)
    this.bits = this.bits.slice(number)
    this.length = this.bits.length
    return toBeShifted
  }
  
  pop(number: number = 1) {
    if(number > this.length) throw new Error("End of stream!")
    const toBePopped = this.bits.slice(this.bits.length - number)
    this.bits = this.bits.slice(0, this.bits.length - number)
    this.length = this.bits.length
    return toBePopped
  }
}

abstract class Packet {
  abstract packetVersion: number
  abstract typeId: number
}

class PayloadPacket extends Packet {
  packetVersion: number  
  typeId: number
  payload: number
  
  constructor(packetVersion: number, typeId: number, payload: number) {
    super()
    this.packetVersion = packetVersion
    this.typeId = typeId
    this.payload = payload
  }
}

class OperatorPacket extends Packet {
  packetVersion: number
  typeId: number
  subPackets: Packet[]
  
  constructor(packetVersion: number, typeId: number, subPackets: Packet[]) {
    super()
    this.packetVersion = packetVersion
    this.typeId = typeId
    this.subPackets = subPackets
  }
}

const input = new StringStream(String(readFileSync('./input.txt')).split('') .map(char => parseInt(char, 16).toString(2).padStart(4, '0')).join(''))

function parseInput(input: StringStream) : Packet {
  const packetVersion = parseInt(input.shift(3), 2)
  const typeId = parseInt(input.shift(3), 2)
  
  if(typeId === 4) { // PayloadPacket
    let payload = ''
    while(true) {
      const continueFlag = parseInt(input.shift(1), 2)
      payload += input.shift(4)
      if(continueFlag === 0) break
    }
    return new PayloadPacket(packetVersion, typeId, parseInt(payload, 2))
  } 
  else { // OperatorPacket
    const lengthTypeId = parseInt(input.shift(1), 2)
    const counter: number = parseInt(input.shift(lengthTypeId === 0 ? 15 : 11), 2) 
    const subPackets: Packet[] = []
    if(lengthTypeId === 0) { // Given length
      const subInput = new StringStream(input.shift(counter))
      while(subInput.length > 0) {
        subPackets.push(parseInput(subInput))
      }
    } 
    else { // Given number of subPackets
      for(let i = 0; i < counter; i++) {
        subPackets.push(parseInput(input))
      }
    }
    return new OperatorPacket(packetVersion, typeId, subPackets)
  }
}

function getRecursivePacketVersionSum(packet: Packet): number {
  if(packet instanceof OperatorPacket) {
    return packet.packetVersion + packet.subPackets.map(packet => getRecursivePacketVersionSum(packet)).reduce((sum, current) => sum + current, 0)
  }
  return packet.packetVersion
}

const packet = parseInput(input)
console.log(input.length)
console.log(packet)

console.log(getRecursivePacketVersionSum(packet))