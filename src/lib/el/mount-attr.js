import { onRemoved } from './on-removed.js'
import { effect } from './reactive.js'
import { setAttr } from './attr.js'
import { createGetter, camelCase } from './util.js'

export function mountAttr(attrNode, context) {
  if (!attrNode.name.startsWith(':')) return

  const owner = attrNode.ownerElement
  const attrName = attrNode.name.slice(1)
  const propName = camelCase(attrName)
  const getValue = createGetter(attrNode.value)

  owner.removeAttributeNode(attrNode)

  const clearEffect = effect(() => {
    const value = getValue(context)

    if (attrName !== 'style' && propName in owner) {
      owner[propName] = value
    } else {
      setAttr(owner, attrName, value)
    }
  })

  onRemoved(owner, clearEffect)

  return true
}
