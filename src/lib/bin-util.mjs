import { readFile, mkdir, glob } from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { dirname } from 'node:path'

export async function packBin(src = './src/bin', out = './dist/data.bin') {
  const paths = await Array.fromAsync(glob('**/*.*', { cwd: src }))

  await mkdir(dirname(out), { recursive: true })
  const ws = createWriteStream(out)

  const files = []
  let offset = 0

  for (const path of paths) {
    const file = await readFile(`${src}/${path}`)
    ws.write(file)
    files.push([path, [offset, file.length]])
    offset += file.length
  }

  ws.end()
  return files
}
