import React, { Component } from "react"
import "../css-components/Element.css"

class Element extends Component {
  /////////////////////////////////////////////////////
  // Conditonal rendering logic
  /////////////////////////////////////////////////////
  classIdentifiers = () => {
    const mod = this.props.elem.modifiable
    const row = this.props.elem.row
    const col = this.props.elem.col
    let iden = "input_elem "
    if (!mod) {
      iden += " readonly"
    }
    if (row === 0 || row === 3 || row === 6) {
      iden += " left"
    }
    if (row === 2 || row === 5 || row === 8) {
      iden += " right"
    }
    if (col === 0 || col === 3 || col === 6) {
      iden += " top"
    }
    if (col === 2 || col === 5 || col === 8) {
      iden += " bottom"
    }
    return iden
  }

  /////////////////////////////////////////////////////
  // Updating state functions
  /////////////////////////////////////////////////////
  inputChange = (e) => {
    let val = Number(e.currentTarget.value.slice(-1)[0])
    const valStr = e.currentTarget.value.split("").reverse().join("")
    if (isNaN(val) || val === 0) {
      if (valStr.length > 1) {
        val = Number(valStr[1])
      } else {
        val = ""
      }
    }
    this.props.updateGrid(val, this.props.elem.index)
  }

  render() {
    return (
      <>
        <input className={this.classIdentifiers()} value={this.props.elem.value} readOnly={!this.props.elem.modifiable} onChange={this.inputChange} />
      </>
    )
  }
}
export default Element
