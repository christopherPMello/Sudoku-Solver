function createBoard(start) {
  let initalGrid = {
    name: "Soduku",
    length: 9,
    data: [],
  }
  for (let i = 0; i < 9; i++) {
    const row = { cols: [], length: 9, col_index: i }
    for (let j = 0; j < 9; j++) {
      let value = ""
      let modifiable = false
      if (start === true) {
        if (j === 0 || j === 3 || j === 6 || ((j === 1 || j === 2) && (i === 3 || i === 4))) {
          value = 1
        }
      } else {
        modifiable = true
      }
      const col_details = {
        col: i,
        row: j,
        index: i * 9 + j,
        value: value,
        modifiable: modifiable,
      }
      row.cols.push(col_details)
    }
    initalGrid.data.push(row)
  }
  return initalGrid
}

export { createBoard }
