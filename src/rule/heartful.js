import { initCells, separate } from './util.js'

export const name = 'ハートフル'

export const meta = {
  '3x3': [{ moves: 3, num: 1, none: 2 }, { moves: 4, none: 2 }, { moves: 5 }],
  '4x4': [
    { moves: 4, num: 4, none: 6 },
    { moves: 6, htNum: 3, none: 4 },
    { moves: 8, none: 4 },
  ],
  '5x5': [
    { moves: 8, htNum: 6, none: 7 },
    { moves: 9, htNum: 2, none: 9 },
    { moves: 10, none: 7 },
  ],
}

export function gen({ area, areaKey, level }) {
  const { moves: htNumSel, htNum, num, none } = meta[areaKey][level]
  const defs = [
    [htNumSel, { heart: true, number: true, color: 0, selectable: true }],
    [htNum, { heart: true, number: true, color: 0 }],
    [num, { number: true, color: 0 }],
    [none, {}],
  ]
  const answer = initCells(area, defs, { selectable: true })
  const { cells, rests } = separate(answer)
  return { answer, cells, rests }
}
