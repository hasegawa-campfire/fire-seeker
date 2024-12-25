export function shuffle(items) {
  return items
    .map((v) => [Math.random(), v])
    .sort(([a], [b]) => a - b)
    .map(([, v]) => v)
}

export function times(length, value) {
  return Array.from({ length }).map(() => structuredClone(value))
}

export function initCells(area, defs, blank) {
  let list = []
  for (const [len, cell] of defs) list.push(...times(len ?? 0, cell))

  const length = area.w * area.h
  if (list.length > length) list = list.slice(0, length)
  if (list.length < length) list = [...list, ...times(length - list.length, blank)]

  list = shuffle(list)

  for (let i = 0; i < list.length; i++) {
    if (list[i].number) list[i].count = counting(area, list, i)
  }

  return list
}

export function separate(list) {
  const rests = []
  const cells = list.map((cell) => {
    if (!cell.selectable || (!cell.number && !cell.heart)) return cell
    rests.push(cell)
    return { selectable: true }
  })
  rests.sort((a, b) => {
    if (a.color !== b.color) return a.color - b.color
    if (a.heart !== b.heart) return a.heart ? -1 : 1
    if (a.number !== b.number) return a.number ? -1 : 1
    if (!a.number) return 0
    return a.count - b.count
  })
  return { cells, rests }
}

// const scopeMasks = [
//   [0x80, 0x40, 0x20],
//   [0x10, 0xff, 0x08],
//   [0x04, 0x02, 0x01],
// ]

export function counting(area, list, index) {
  if (!list[index].number) return

  const x = index % area.w
  const y = Math.floor(index / area.w)
  const color = list[index].color

  let result = 0

  for (const vy of [-1, 0, 1]) {
    if (y + vy < 0 || y + vy >= area.h) continue

    for (const vx of [-1, 0, 1]) {
      if (x + vx < 0 || x + vx >= area.w) continue

      const cell = list[x + vx + (y + vy) * area.w]
      // const countable = scopeMasks[vy + 1][vx + 1] & scope
      if (cell.heart && cell.color === color) result++
    }
  }

  return result
}

export function distribute(value, div) {
  value = value ?? 0
  const n = Math.floor(value / div)
  const q = value % div
  return Array.from({ length: div }).map((_, i) => n + (i < q ? 1 : 0))
}
