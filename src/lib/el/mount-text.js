import { onRemoved } from './on-removed.js'
import { effect } from './reactive.js'
import { createGetter } from './util.js'

export function mountText(textNode, context) {
  if (!/\$\{.*\}/.test(textNode.nodeValue)) return

  const getValue = createGetter(`\`${textNode.nodeValue.replaceAll('`', '\\`')}\``)

  const clearEffect = effect(() => {
    textNode.nodeValue = getValue(context)
  })

  onRemoved(textNode, clearEffect)

  return true
}
