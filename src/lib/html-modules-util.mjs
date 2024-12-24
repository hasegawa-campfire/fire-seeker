export function html2module(html) {
  let script = ''

  html = html.replace(/<script[\s\S]*?>([\s\S]*?)<\/script>/g, (_, content) => {
    script += content
    return ''
  })

  return `
    var __import_meta_document__ = new DOMParser().parseFromString(${JSON.stringify(html)}, 'text/html');
    ${script.replaceAll('import.meta.document', '__import_meta_document__')}
  `
}
