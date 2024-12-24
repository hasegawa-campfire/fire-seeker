import { readFile, glob } from 'node:fs/promises'
import esbuild from 'esbuild'
import { htmlPlugin } from '@craftamap/esbuild-plugin-html'
import { copy } from 'esbuild-plugin-copy'
import { JSDOM } from 'jsdom'
import { packBin } from './src/lib/bin-util.mjs'
import htmlModules from './src/lib/html-modules.mjs'

const dom = new JSDOM(await readFile('src/index.html'))
for (const el of dom.window.document.querySelectorAll('[data-prod-remove]')) el.remove()
for (const el of dom.window.document.querySelectorAll('template[data-prod-expand]')) el.replaceWith(el.content)

await esbuild.build({
  bundle: true,
  entryPoints: ['src/main.js'],
  minify: true,
  metafile: true,
  outdir: 'dist/',
  format: 'esm',
  define: {
    BIN_FILES: JSON.stringify(await packBin()),
  },
  plugins: [
    htmlModules(),
    htmlPlugin({
      files: [
        {
          entryPoints: ['src/main.js'],
          filename: 'index.html',
          htmlTemplate: dom.serialize(),
          scriptLoading: 'module',
        },
      ],
    }),
    copy({
      assets: [
        { from: './src/assets/*', to: './assets' },
        { from: './src/manifest.json', to: './' },
      ],
    }),
  ],
  alias: {
    '@': './src',
    'package.json': './package.json',
  },
})

const cachePaths = await Array.fromAsync(glob('**/*.*', { cwd: './dist', ignore: ['index.html'] }))

await esbuild.build({
  bundle: true,
  entryPoints: ['src/sw.js'],
  minify: true,
  outdir: 'dist/',
  format: 'esm',
  define: {
    CACHE_PATTERNS: JSON.stringify([...cachePaths, String(/fonts.(googleapis|gstatic).com/)]),
  },
})
