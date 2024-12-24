import { initCells, separate } from './util.js'

export const name = 'シンプル'

export const meta = {
  '3x3': [{ moves: 2, num: 3, none: 2 }, { moves: 3, num: 3 }, { moves: 4, num: 3 }],
  '4x4': [{ moves: 4, num: 8 }, { moves: 5, num: 6 }, { moves: 6, num: 4 }],
  '5x5': [{ moves: 6, num: 13 }, { moves: 7, num: 11 }, { moves: 8, num: 9 }],
}

export function gen({ area, areaKey, level }) {
  const { moves: htSel, num, none } = meta[areaKey][level]
  const defs = [
    [htSel, { heart: true, color: 0, selectable: true }],
    [num, { number: true, color: 0 }],
    [none, {}],
  ]
  const answer = initCells(area, defs, { selectable: true })
  const { cells, rests } = separate(answer)
  return { answer, cells, rests }
}
