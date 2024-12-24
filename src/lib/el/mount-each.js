import { onRemoved } from './on-removed.js'
import { asyncEffect, reactive } from './reactive.js'
import { createGetter, createContainer, wrapObject } from './util.js'

export function mountEach(temp, context, mount) {
  if (!temp.hasAttribute(':each')) return

  const itemAs = temp.getAttribute('item-as') || 'item'
  const indexAs = temp.getAttribute('index-as') || 'index'
  const getValue = createGetter(temp.getAttribute(':each') ?? '')
  const getKey = createGetter(temp.getAttribute(':key') || indexAs)
  const wrapper = createContainer()
  const infoMap = new Map()

  temp.replaceWith(wrapper)

  const clearEffect = asyncEffect(() => {
    const items = getValue(context)
    const itemKeys = items.map((item, index) => getKey({ [itemAs]: item, [indexAs]: index }))

    if (hasDuplicate(itemKeys)) throw Error('duplicate key value')

    for (const [key, info] of infoMap.entries()) {
      if (!itemKeys.includes(key)) {
        info.node.remove()
        infoMap.delete(key)
      }
    }

    items.forEach((item, index) => {
      const key = itemKeys[index]
      const info = infoMap.get(key)

      if (info) {
        insertChild(wrapper, index, info.node)
        Object.assign(info.context, { [itemAs]: item, [indexAs]: index })
      } else {
        const node = createContainer(document.importNode(temp.content, true))
        const ctx = reactive(Object.assign(wrapObject(context), { [itemAs]: item, [indexAs]: index }))
        insertChild(wrapper, index, node)
        mount(node, ctx)
        infoMap.set(key, { node, context: ctx })
      }
    })
  })

  onRemoved(wrapper, clearEffect)

  return true
}

function insertChild(parent, index, node) {
  if (index === 0) {
    if (node.parentNode !== parent || node.previousElementSibling !== null) {
      parent.insertBefore(node, parent.firstElementChild)
    }
  } else {
    const prev = parent.children[index - 1]
    if (node.parentNode !== parent || node.previousElementSibling !== prev) {
      prev.after(node)
    }
  }
}

function hasDuplicate(arr) {
  return arr.some((v, i, a) => a.includes(v, i + 1))
}
