export function onRemoved(node, callback) {
  const owner = getOwner(node)
  if (owner) {
    const { callbacks } = getObserverInfo(owner)

    const cb = () => {
      if (!node.isConnected) {
        observeInfoMap.get(node)?.observer.disconnect()
        callbacks.delete(cb)
        callback()
      }
    }

    callbacks.add(cb)
    onRemoved(owner, cb)
  }
}

function getOwner(node) {
  if (!node.isConnected) return null
  if (node instanceof Document) return null
  if (node instanceof ShadowRoot) return node.host.getRootNode()
  return node.getRootNode()
}

const observeInfoMap = new WeakMap()

function getObserverInfo(node) {
  let info = observeInfoMap.get(node)

  if (!info) {
    const callbacks = new Set()
    const observer = new MutationObserver(() => {
      for (const cb of [...callbacks]) cb()
    })
    observer.observe(node, { childList: true, subtree: true })
    info = { callbacks, observer }
    observeInfoMap.set(node, info)
  }

  return info
}
