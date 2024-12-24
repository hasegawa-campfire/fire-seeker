import { reactiveProp } from './reactive.js'
import { syncPropWithAttr } from './attr.js'
import { adoptContent } from './shadow.js'
import { mount } from './mount.js'

export * from './reactive.js'
export * from './on-removed.js'
export { raw } from './util.js'

export function setupEl(el, doc) {
  for (const prop of Object.keys(el)) {
    syncPropWithAttr(el, prop)
    reactiveProp(el, prop)
  }

  const shadow = el.shadowRoot ?? el.attachShadow({ mode: 'open' })
  adoptContent(shadow, doc)
  mount(shadow, el)
}
