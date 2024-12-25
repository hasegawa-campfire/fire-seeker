import { kebabCase } from './util.js'

export function syncPropWithAttr(el, propName, valueType = null) {
  valueType = valueType ?? typeof el[propName]
  const attrName = kebabCase(propName)

  if (el.hasAttribute(attrName)) {
    el[propName] = getAttr(el, attrName, valueType)
    el.removeAttribute(attrName)
  }
}

export function getAttr(el, attrName, valueType = 'string') {
  const value = el.getAttribute(attrName)

  return valueType === 'number' || valueType === 'bigint'
    ? Number(value)
    : valueType === 'boolean'
      ? value !== 'false'
      : value
}

export function setAttr(el, attrName, value) {
  const valueType = typeof value

  if (value === null || value === undefined || value === false) {
    el.removeAttribute(attrName)
  } else if (value === true) {
    el.setAttribute(attrName, '')
  } else if (attrName === 'class' && valueType === 'object') {
    const classes = new Set()

    for (const clazz of [value].flat(8)) {
      if (typeof clazz === 'string') {
        classes.add(clazz)
      } else if (typeof clazz === 'object' && clazz !== null) {
        for (const [k, v] of Object.entries(clazz)) {
          if (v) classes.add(k)
        }
      }
    }
    el.setAttribute(attrName, [...classes].join(' '))
  } else if (attrName === 'style' && valueType === 'object') {
    Object.assign(el.style, value)
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('--')) el.style.setProperty(k, v)
    }
  } else if (attrName === 'data' && valueType === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (v === null || v === undefined || v === false) {
        delete el.dataset[k]
      } else {
        el.dataset[k] = v
      }
    }
  } else {
    el.setAttribute(attrName, value)
  }
}
