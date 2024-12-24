import { walkNode } from './util.js'
import { mountIf } from './mount-if.js'
import { mountEach } from './mount-each.js'
import { mountAttr } from './mount-attr.js'
import { mountText } from './mount-text.js'

export function mount(el, context) {
  for (const temp of [...el.querySelectorAll('template')]) {
    if (!mountIf(temp, context, mount)) {
      mountEach(temp, context, mount)
    }
  }

  for (const textNode of walkNode(el, NodeFilter.SHOW_TEXT)) {
    mountText(textNode, context)
  }

  for (const { attributes } of walkNode(el, NodeFilter.SHOW_ELEMENT)) {
    for (const attrNode of [...attributes]) {
      mountAttr(attrNode, context)
    }
  }
}
