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
      level: null,
      message: "Please select a difficulty and click 'New Grid' to play!",
    }
  }

  solveSudoku = () => {
    return 1
  }

  checkSudoku = () => {
    return 1
  }

  generateSudoku = async (e) => {
    e.preventDefault()
    if (this.state.level === null) {
      return
    }
    // Get puzzle data
    let puzzle = await Axios.get("/cheon/ws/sudoku/new/?size=9&level=" + this.state.level)

    // Clear a board
    let newBoard = Object.assign({}, this.state.board)
    newBoard.data.forEach((element) => element.cols.forEach((elem) => ((elem.value = ""), (elem.modifiable = true))))

    const puzzleData = puzzle.data.squares
    for (let i = 0; i < puzzleData.length; i++) {
      newBoard.data.find((a) => a.col_index === puzzleData[i].x).cols.find((b) => b.row === puzzleData[i].y).value = puzzleData[i].value
      newBoard.data.find((a) => a.col_index === puzzleData[i].x).cols.find((b) => b.row === puzzleData[i].y).modifiable = false
    }
    this.setState((prev) => ({ board: newBoard }))
    this.updateMessage()
  }

  updateGrid = (val, index) => {
    let newBoard = Object.assign({}, this.state.board)
    newBoard.data.find((a) => a.col_index === Math.floor(index / 9)).cols.find((b) => b.index === index).value = val
    this.setState((prev) => ({ board: newBoard }))
  }

  updateMessage = () => {
    let difficulty = null
    if (this.state.level === 1) {
      difficulty = "Easy"
    } else if (this.state.level === 2) {
      difficulty = "Medium"
    } else {
      difficulty = "Hard"
    }
    if (difficulty) {
      this.setState((prev) => ({ message: `Good luck on your ${difficulty} Sudoku problem!` }))
    }
  }

  update_level = (e) => {
    const event = e.currentTarget.value
    this.setState((prev) => ({ level: event }))
  }

  render() {
    return (
      <div>
        <video className="video-container" playsInline="playsinline" autoPlay="autoplay" muted="muted" loop="loop">
          <source src={Foggy} type="video/mp4" />
        </video>
        <nav className="navbar navbar-light bg-light">
          <form className="form-inline navbar-form d-flex justify-content-center w-100">
            <div className="form-check form-check-inline">
              <input className="form-check-input" onChange={this.update_level} type="radio" name="difficulty" id="Easy" value={1} />
              <label className="form-check-label" htmlFor="inlineRadio1">
                Easy
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" onChange={this.update_level} type="radio" name="difficulty" id="Medium" value={2} />
              <label className="form-check-label" htmlFor="inlineRadio2">
                Medium
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" onChange={this.update_level} type="radio" name="difficulty" id="Hard" value={3} />
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
              <button onClick={this.generateSudoku} className="btn btn-dark btn-sm" type="submit">
                Check
              </button>
            </div>
            <div className="form-check form-check-inline">
              <button className="btn btn-dark btn-sm" type="submit">
                Solve
              </button>
            </div>
          </form>
        </nav>
        <Grid board={this.state.board} updateGrid={this.updateGrid} />
      </div>
    )
  }
}

export default HomePage
