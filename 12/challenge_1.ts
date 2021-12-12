import { readFileSync } from 'fs'

class Node {
  name: string
  isBig: boolean
  neighbors: Node[] = []
  constructor(name: string) {
    this.name = name
    this.isBig = name[0] === name[0].toLocaleUpperCase()
  }

  addNeighbor(neighbor: Node) {
    this.neighbors.push(neighbor)
  }

  toString(): string {
    return this.name
  }
}

class Path {
  nodes: Node[] = []
  constructor(nodes: Node[]) {
    this.nodes = nodes
  }

  isComplete(): boolean {
    return this.nodes[0] === startNode && this.nodes[this.nodes.length - 1] === endNode 
  }
}


// initialize nodes and neigbors

const rows: string[] = String(readFileSync('./input.txt')).split('\n').map(line => line.trim())
const nodeNameSet = new Set<string>()
rows.flatMap(row => row.split('-')).forEach(nodeName => nodeNameSet.add(nodeName))
const nodes = [...nodeNameSet].map(nodeName => new Node(nodeName))

for(const row of rows) {
  const [fromNodeName, toNodeName] = row.split('-')
  const fromNode = nodes.find(node => node.name === fromNodeName)!
  const toNode = nodes.find(node => node.name === toNodeName)!
  fromNode.addNeighbor(toNode)
  toNode.addNeighbor(fromNode)
}

const startNode = nodes.find(node => node.name === 'start')!
const endNode = nodes.find(node => node.name === 'end')!

const paths: Path[] = []

function search(path: Path) {
  if(path.isComplete()) {
    paths.push(path)
    return
  }

  const currentNode = path.nodes[path.nodes.length - 1]
  for(const node of currentNode.neighbors) {
    // only allowed to go to small nodes once, so if we've seen them already, just skip 'em
    if(node.isBig || !path.nodes.includes(node)) {
      search(new Path([...path.nodes, node]))
    }
  }
}

search(new Path([startNode]))
console.log(paths.length)