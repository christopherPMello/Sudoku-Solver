import React, { Component } from "react"
import "../css-components/Grid.css"
import Element from "./Element"

class Grid extends Component {
  render() {
    return (
      <div className="Grid">
        {this.props.board.data.map((row) => (
          <div className="element" key={row.col_index}>
            {row.cols.map((elem) => (
              <Element elem={elem} key={elem.index} updateGrid={this.props.updateGrid} />
            ))}
          </div>
        ))}
      </div>
    )
  }
}

export default Grid
