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

  public abstract getValue(): number
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

  public getValue(): number {
    return this.payload
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

  public getValue(): number {
    switch(this.typeId) {
      case 0: return this.subPackets.reduce((sum,  packet) => sum + packet.getValue(), 0)
      case 1: return this.subPackets.reduce((prod, packet) => prod * packet.getValue(), 1)
      case 2: return this.subPackets.reduce((min,  packet) => Math.min(min, packet.getValue()), Infinity)
      case 3: return this.subPackets.reduce((max,  packet) => Math.max(max, packet.getValue()), -Infinity)
      case 5: return this.subPackets[0].getValue() >  this.subPackets[1].getValue() ? 1 : 0
      case 6: return this.subPackets[0].getValue() <  this.subPackets[1].getValue() ? 1 : 0
      case 7: return this.subPackets[0].getValue() == this.subPackets[1].getValue() ? 1 : 0
      default: return 0
    }
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

const packet = parseInput(input)
console.log(packet.getValue())