import { onRemoved } from './on-removed.js'
import { effect } from './reactive.js'
import { createGetter, createContainer } from './util.js'

export function mountIf(temp, context, mount) {
  if (!temp.hasAttribute(':if')) return

  const getValue = createGetter(temp.getAttribute(':if') ?? '')
  const wrapper = createContainer()
  let state = false

  temp.replaceWith(wrapper)

  const clearEffect = effect(() => {
    const newState = !!getValue(context)

    if (state !== newState) {
      state = newState

      if (state) {
        wrapper.replaceChildren(document.importNode(temp.content, true))
        mount(wrapper, context)
      } else {
        wrapper.replaceChildren()
      }
    }
  })

  onRemoved(wrapper, clearEffect)

  return true
}
