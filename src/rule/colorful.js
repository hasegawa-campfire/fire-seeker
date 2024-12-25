import { initCells, separate, distribute } from './util.js'

export const name = 'カラフル'

export const meta = {
  '3x3': [{ moves: 6, none: 2 }, { moves: 7, none: 1 }, { moves: 9 }],
  '4x4': [{ moves: 8, num: 6, none: 1 }, { moves: 10, htNum: 4 }, { moves: 16 }],
  '5x5': [
    { moves: 12, num: 9, none: 3, cols: 3 },
    { moves: 15, htNum: 6, none: 2, cols: 3 },
    { moves: 25, cols: 3 },
  ],
}

export function gen({ area, areaKey, level }) {
  const { moves: htNumSel, htNum, num, none, cols = 2 } = meta[areaKey][level]
  const defs = [
    ...distribute(htNumSel, cols).map((n, i) => [n, { heart: true, number: true, color: i, selectable: true }]),
    ...distribute(htNum, cols).map((n, i) => [n, { heart: true, number: true, color: i }]),
    ...distribute(num, cols).map((n, i) => [n, { number: true, color: i }]),
    [none, {}],
  ]
  const answer = initCells(area, defs, { selectable: true })
  const { cells, rests } = separate(answer)
  return { answer, cells, rests }
}
