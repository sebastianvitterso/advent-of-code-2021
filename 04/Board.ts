/**
 * A bingo board
 */
export default class Board {
  private static index = 0
  public readonly id: number
  public boardNumbers: number[][]
  public boardMarkers: boolean[][]

  /**
   * @param board A 2d, 5x5 array of numbers, representing the numbers on the bingo board.
   */
  constructor(board: number[][]) {
    this.id = Board.index++
    this.boardNumbers = board
    this.boardMarkers = new Array(5).fill(0).map(_ => Array(5).fill(false))
  }

  /**
   * @param number The number that was just announced
   * @returns `true` if a number was marked off on the board, `false` otherwise.
   */
  public giveNumber(number: number) : boolean {
    for(const [rowIndex, boardRow] of this.boardNumbers.entries()) {
      for(const [colIndex, boardNumber] of boardRow.entries()) {
        if(boardNumber === number) {
          this.boardMarkers[rowIndex][colIndex] = true
          return true
        }
      }
    }
    return false
  }
  /**
   * @returns `true` if the board has won, `false` otherwise.
   */
  public hasWon() : boolean {
    return this.hasWinningColumn() || this.hasWinningRow()
  }

  /** @returns `true` if at least one of the rows has all of their marks set to `true`. Otherwise returns `false`.*/
  private hasWinningRow() : boolean {
    return this.boardMarkers.some(boardMarkerRow => boardMarkerRow.every(mark => mark))
  }

  /** @returns `true` if at least one of the columns has all of their marks set to `true`. Otherwise returns `false`.*/
  private hasWinningColumn() : boolean {
    // transposing source: https://stackoverflow.com/a/17428705/11192976
    const transposedBoardMarkers = this.boardMarkers[0].map((col, i) => this.boardMarkers.map(row => row[i]));
    return transposedBoardMarkers.some(boardMarkerCol => boardMarkerCol.every(mark => mark))
  }

  /**
   * @param lastCalledNumber The last number that was given
   * @returns The score, as per the description in the task
   */
  public getScore(lastCalledNumber: number) : number {
    if(!this.hasWon()) {
      throw new Error("Can't getScore without winning!")
    }

    let pointSum = 0
    for(const [rowIndex, boardRow] of this.boardNumbers.entries()) {
      for(const [colIndex, boardNumber] of boardRow.entries()) {
        if(!this.boardMarkers[rowIndex][colIndex]) {
          pointSum += boardNumber
        }
      }
    }

    return pointSum * lastCalledNumber
  }

}