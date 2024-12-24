export function adoptContent(shadow, doc) {
  if (typeof doc._templateContent === 'undefined') {
    doc._templateContent = doc.querySelector('template')?.content ?? null
  }

  if (typeof doc._styles === 'undefined') {
    const styles = [...doc.querySelectorAll('style')]
    doc._styleSheets = styles.map((el) => createCSSStyleSheet(el.textContent))
  }

  if (doc._templateContent) {
    shadow.append(document.importNode(doc._templateContent, true))
  }

  shadow.adoptedStyleSheets = [...doc._styleSheets]

  return shadow
}

function createCSSStyleSheet(content = '', options) {
  const sheet = new CSSStyleSheet(options)
  sheet.replaceSync(content)
  return sheet
}
