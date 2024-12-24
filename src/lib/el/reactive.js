import { raw, rawKey } from './util.js'

const targetMap = new WeakMap()
const proxySet = new WeakSet()
const ownKeysKey = Symbol()

export function reactive(target) {
  if (target === null || typeof target !== 'object' || proxySet.has(target)) return target
  if (targetMap.has(target)) return targetMap.get(target)

  const depsMap = new Map()

  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === rawKey) return target
      track(depsMap, key)
      if (!Object.hasOwn(target, key)) return Reflect.get(target, key, receiver)
      return reactive(Reflect.get(target, key, receiver))
    },

    set(target, key, value, receiver) {
      value = raw(value)
      const oldValue = Reflect.get(target, key, receiver)
      const result = Reflect.set(target, key, value, receiver)
      if (value !== oldValue) {
        trigger(depsMap, key)
        trigger(depsMap, ownKeysKey)
      }
      return result
    },

    has(target, key) {
      track(depsMap, key)
      return Reflect.has(target, key)
    },

    ownKeys(target) {
      track(depsMap, ownKeysKey)
      return Reflect.ownKeys(target)
    },

    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key)
      if (result) {
        trigger(depsMap, key)
        trigger(depsMap, ownKeysKey)
      }
    }
  })

  targetMap.set(target, proxy)
  proxySet.add(proxy)
  return proxy
}

const activeEffects = []

export function effect(fn) {
  const depSet = new Set()

  const clearDep = () => {
    for (const dep of depSet) dep.delete(effectFn)
    depSet.clear()
  }

  const effectFn = () => {
    clearDep()
    activeEffects.push({ fn: effectFn, depSet })
    try {
      fn()
    } finally {
      activeEffects.pop()
    }
  }

  effectFn()
  return () => {
    clearDep()
  }
}

export function asyncEffect(fn) {
  let released = false
  const depSet = new Set()

  const clearDep = () => {
    for (const dep of depSet) dep.delete(effectFn)
    depSet.clear()
  }

  const effectFn = () => {
    clearDep()
    queueMicrotask(effectFnTask)
  }

  const effectFnTask = () => {
    if (released) return
    activeEffects.push({ fn: effectFn, depSet })
    try {
      fn()
    } finally {
      activeEffects.pop()
    }
  }

  effectFn()
  return () => {
    released = true
    clearDep()
  }
}

function track(depsMap, key) {
  const activeEffect = activeEffects.at(-1)
  if (!activeEffect) return

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  activeEffect.depSet.add(dep)
  dep.add(activeEffect.fn)
}

function trigger(depsMap, key) {
  const dep = depsMap.get(key)
  if (dep) {
    for (const effectFn of [...dep]) effectFn()
  }
}

export function reactiveProp(obj, propName) {
  const depsMap = new Map()
  let propValue = obj[propName]

  Object.defineProperty(obj, propName, {
    get() {
      track(depsMap, propName)
      return reactive(propValue)
    },

    set(value) {
      value = raw(value)
      if (propValue === value) return
      propValue = value
      trigger(depsMap, propName)
    },
  })
}
