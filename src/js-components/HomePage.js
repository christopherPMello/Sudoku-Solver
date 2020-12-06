import React, { Component } from "react"
import Axios from "axios"
import Foggy from "../attachments/Foggy_Mountain.mp4"
import "../css-components/HomePage.css"
import "sudoku"
import { createBoard } from "../attachments/InitalGrid"
import Grid from "./Grid"

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      board: createBoard(true),
      untouchedBoard: null,
      level: null,
      message: "Please select a difficulty and click 'New Puzzle' to play!",
    }
  }

  /////////////////////////////////////////////////////
  // Solving Sudoku functions
  /////////////////////////////////////////////////////
  solveSudokuMain = (e) => {
    e.preventDefault()
    this.solveSudokuRecuse(this.state.untouchedBoard)
    console.log(this.state.board)
  }

  solveSudokuRecuse = (board, row = null, col = null, quad = null) => {
    const unassigned = this.firstUnassignedLocation(board)
    if (unassigned === undefined) {
      this.setState((prev) => ({ message: "Puzzle solved!", board: board }))
      return true
    }

    row = unassigned.row
    col = unassigned.col
    quad = unassigned.quad

    for (let i = 0; i < board.length; i++) {
      const vals = this.checkColRowQuad(board, row, col, quad)
      console.log(vals)
      const status = vals.row.includes(i + 1) && vals.col.includes(i + 1) && vals.quad.includes(i + 1)
      console.log(status)

      if (status) {
        board.data.find((a) => a.col_index === col).cols.find((b) => b.row === row).value = i + 1

        if (this.solveSudokuRecuse(board, row, col, quad)) {
          this.setState((prev) => ({ message: "Puzzle solved!", board: board }))
          return true
        }
        board.data.find((a) => a.col_index === col).cols.find((b) => b.row === row).value = ""
      }
    }
    return false
  }

  firstUnassignedLocation = (board) => {
    let unassignedVals = []
    board.data.forEach((element) => {
      element.cols.forEach((subElement) => {
        if (subElement.value === "") unassignedVals.push({ row: subElement.row, col: subElement.col, quad: subElement.quadrant })
      })
    })

    return unassignedVals[0]
  }

  checkColRowQuad = (board, col, row, quad) => {
    let col_set = [],
      row_set = [],
      quad_set = []
    board.data.forEach((element) => {
      element.cols.forEach((subElement) => {
        if (subElement.col === col) col_set.push(subElement.value)
      })
    })
    board.data.forEach((element) => {
      element.cols.forEach((subElement) => {
        if (subElement.row === row) row_set.push(subElement.value)
      })
    })
    board.data.forEach((element) => {
      element.cols.forEach((subElement) => {
        if (subElement.quadrant === quad) quad_set.push(subElement.value)
      })
    })
    return { col: col_set, row: row_set, quad: quad_set }
  }

  /////////////////////////////////////////////////////
  // Checking Sudoku function
  /////////////////////////////////////////////////////
  checkSudoku = (e) => {
    e.preventDefault()

    // Make sure a level was chosen
    if (this.state.untouchedBoard === null) {
      this.setState((prev) => ({ message: "Choose a puzzle to solve!" }))
      return
    }

    // Gather column, row, and quad inputs
    for (let i = 0; i < this.state.board.length; i++) {
      let vals = this.checkColRowQuad(this.state.board, i, i, i)
      let col_set = vals.col,
        row_set = vals.row,
        quad_set = vals.quad

      // Make sure that there is exactly
      for (let j = 0; j < this.state.board.length; j++) {
        if (col_set.sort()[j] !== j + 1 || row_set.sort()[j] !== j + 1 || quad_set.sort()[j] !== j + 1) {
          this.setState((prev) => ({ message: "That is not a correct solution. Keep on trying!" }))
          return
        }
      }
    }
    this.setState((prev) => ({ message: "Nicely done! You solved it!" }))
  }

  /////////////////////////////////////////////////////
  // Generating Sudoku function
  /////////////////////////////////////////////////////
  generateSudoku = async (e) => {
    e.preventDefault()
    // Change message in banner
    if (this.state.level === null) {
      this.setState((prev) => ({ message: "Choose a difficulty level!" }))
      return
    }
    // Get puzzle data
    let puzzle = await Axios.get("/cheon/ws/sudoku/new/?size=9&level=" + this.state.level)

    // Clear a board
    let newBoard = Object.assign({}, this.state.board)
    newBoard.data.forEach((element) => element.cols.forEach((elem) => ((elem.value = ""), (elem.modifiable = true))))

    // Update the board in state with puzzle
    const puzzleData = puzzle.data.squares
    for (let i = 0; i < puzzleData.length; i++) {
      newBoard.data.find((a) => a.col_index === puzzleData[i].x).cols.find((b) => b.row === puzzleData[i].y).value = puzzleData[i].value
      newBoard.data.find((a) => a.col_index === puzzleData[i].x).cols.find((b) => b.row === puzzleData[i].y).modifiable = false
    }
    this.setState((prev) => ({ board: newBoard, untouchedBoard: newBoard }))
    this.updateMessage()
  }

  /////////////////////////////////////////////////////
  // Updating state functions
  /////////////////////////////////////////////////////
  updateGrid = (val, index) => {
    // Update the grid with input
    let newBoard = Object.assign({}, this.state.board)
    newBoard.data.find((a) => a.col_index === Math.floor(index / 9)).cols.find((b) => b.index === index).value = val
    this.setState((prev) => ({ board: newBoard }))
  }

  updateMessage = () => {
    // Update messaging with level chosen
    let difficulty = null
    if (Number(this.state.level) === 1) {
      difficulty = "easy"
    } else if (Number(this.state.level) === 2) {
      difficulty = "medium"
    } else {
      difficulty = "hard"
    }
    if (difficulty) {
      this.setState((prev) => ({ message: `Good luck on your ${difficulty} Sudoku problem!` }))
    }
  }

  updateLevel = (e) => {
    // Update level
    const event = e.currentTarget.value
    this.setState((prev) => ({ level: event }))
  }

  render() {
    return (
      <div>
        <video className="video-container" playsInline="playsinline" autoPlay="autoplay" muted="muted" loop="loop">
          <source src={Foggy} type="video/mp4" />
        </video>
        <nav className="navbar navbar-light bg-light ">
          <form className="form-inline navbar-form d-flex justify-content-center w-100">
            <div className="form-check form-check-inline">
              <input className="form-check-input" onChange={this.updateLevel} type="radio" name="difficulty" id="Easy" value={1} />
              <label className="form-check-label" htmlFor="inlineRadio1">
                Easy
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" onChange={this.updateLevel} type="radio" name="difficulty" id="Medium" value={2} />
              <label className="form-check-label" htmlFor="inlineRadio2">
                Medium
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" onChange={this.updateLevel} type="radio" name="difficulty" id="Hard" value={3} />
              <label className="form-check-label" htmlFor="inlineRadio3">
                Hard
              </label>
            </div>
            <div className="form-check form-check-inline">
              <button onClick={this.generateSudoku} className="btn btn-dark btn-sm" type="submit">
                New Puzzle
              </button>
            </div>
            <div className="form-check form-check-inline">
              <button onClick={this.checkSudoku} className="btn btn-dark btn-sm" type="submit">
                Check
              </button>
            </div>
            <div className="form-check form-check-inline">
              <button onClick={this.solveSudokuMain} className="btn btn-dark btn-sm" type="submit">
                Solve
              </button>
            </div>
          </form>
        </nav>
        <h3 className="banner">
          <span className="bannerSpan">{this.state.message}</span>
        </h3>
        <Grid board={this.state.board} updateGrid={this.updateGrid} />
      </div>
    )
  }
}

export default HomePage
