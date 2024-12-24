export function* walkNode(root, whatToShow, filter) {
  const it = document.createNodeIterator(root, whatToShow, filter)
  for (let node; (node = it.nextNode());) yield node
}

export const rawKey = Symbol()

export function raw(value) {
  if (typeof value !== 'object' || value === null) return value
  const v = value[rawKey]
  return v === undefined ? value : raw(v)
}

export function wrapObject(obj) {
  return Object.create(obj, {
    [rawKey]: {
      get() {
        return Object.getPrototypeOf(this)
      }
    }
  })
}

export function createGetter(expr) {
  return new Function('__context__', `with(__context__) return (${expr})`)
}

export function createContainer(...childNodes) {
  const el = document.createElement('div')
  el.style.display = 'contents'
  el.append(...childNodes)
  return el
}

export function camelCase(str) {
  return str.replace(/\-([a-z])/g, (_, c) => c.toUpperCase())
}

export function kebabCase(str) {
  return str.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
}
