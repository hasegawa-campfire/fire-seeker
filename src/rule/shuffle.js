import { initCells, shuffle, distribute, counting } from './util.js'

export const name = 'シャッフル'

export const meta = {
  '3x3': [
    { moves: 1, htSel: 4, numSel: 4, none: 1 },
    { moves: 1, htNumSel: 4, numSel: 4, none: 1 },
    { moves: 1, htNumSel: 9, cols: 2 },
  ],
  '4x4': [
    { moves: 2, htSel: 4, ht: 4, numSel: 4, num: 4 },
    { moves: 2, htNumSel: 4, htNum: 4, numSel: 4, num: 4 },
    { moves: 2, htNumSel: 8, htNum: 8, cols: 2 },
  ],
  '5x5': [
    { moves: 3, htSel: 6, ht: 6, numSel: 6, num: 6, none: 1 },
    { moves: 3, htNumSel: 6, htNum: 6, numSel: 6, num: 6, none: 1 },
    { moves: 3, htNumSel: 12, htNum: 13, cols: 3 },
  ],
}

export function gen({ area, areaKey, level }) {
  const { moves, htSel, ht, htNumSel, htNum, numSel, num, none, cols = 1 } = meta[areaKey][level]
  const defs = [
    ...distribute(htSel, cols).map((n, i) => [n, { heart: true, color: i, selectable: true }]),
    ...distribute(ht, cols).map((n, i) => [n, { heart: true, color: i }]),
    ...distribute(htNumSel, cols).map((n, i) => [n, { heart: true, number: true, color: i, selectable: true }]),
    ...distribute(htNum, cols).map((n, i) => [n, { heart: true, number: true, color: i }]),
    ...distribute(numSel, cols).map((n, i) => [n, { number: true, color: i, selectable: true }]),
    ...distribute(num, cols).map((n, i) => [n, { number: true, color: i }]),
    [none, {}],
  ]

  for (let retry = 0; retry < 10; retry++) {
    const answer = initCells(area, defs, { selectable: true })
    const cells = swap(answer, moves)
    if (!cells || check(area, cells)) continue
    return { answer, cells, rests: [] }
  }

  throw Error('invalid gen settings')
}

function swap(cells, steps) {
  cells = [...cells]
  const indexes = shuffle(cells.flatMap((cell, i) => cell.selectable ? i : []))

  for (let i = 0; i < steps; i++) {
    if (indexes.length < 2) return
    const idx1 = indexes.shift()
    let done = false

    for (let j = 0; j < indexes.length; j++) {
      const idx2 = indexes[j]

      if (!eq(cells[idx1], cells[idx2])) {
        const tmp = cells[idx1]
        cells[idx1] = cells[idx2]
        cells[idx2] = tmp
        indexes.splice(j, 1)
        done = true
        break
      }
    }

    if (!done) return
  }

  return cells
}

function eq(cell1, cell2) {
  return cell1.heart === cell2.heart &&
    cell1.number === cell2.number &&
    cell1.count === cell2.count &&
    cell1.color === cell2.color
}

function check(area, cells) {
  const results = []
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i]
    if (!cell.number) continue
    if (results[cell.color] == null) results[cell.color] = true
    results[cell.color] &&= (cell.count === counting(area, cells, i))
  }
  return Object.values(results).includes(true)
}