import * as simple from './simple.js'
import * as heartful from './heartful.js'
import * as colorful from './colorful.js'
import * as shuffle from './shuffle.js'

export * from './util.js'

export const areaKeys = ['3x3', '4x4', '5x5']

export const areaRuleKeys = {
  '3x3': ['simple', 'heartful', 'colorful', 'shuffle'],
  '4x4': ['simple', 'heartful', 'colorful', 'shuffle'],
  '5x5': ['simple', 'heartful', 'colorful', 'shuffle'],
}

export const areas = {
  '3x3': { w: 3, h: 3, light: 0.6, wavesOpacity: 1, bg: 'linear-gradient(hsl(193.85deg 56.52% 77.45%), hsl(214.12deg 50.66% 63.04%))' },
  '4x4': { w: 4, h: 4, light: 0.5, wavesOpacity: 0.9, bg: 'linear-gradient(#bca8b4, #e99d92 25%, #f3a469)' },
  '5x5': { w: 5, h: 5, light: 0.8, wavesOpacity: 0.8, bg: 'linear-gradient(hsl(222, 46%, 23%), hsl(203, 100%, 26%) 80%, hsl(183, 63%, 40%))' },
}

export const rules = { simple, heartful, colorful, shuffle }

export const areaUnlockRegs = {
  '3x3': {
    heartful: [/^3x3_simple_/],
    colorful: [/^3x3_heartful_/],
    shuffle: [/^3x3_colorful_/],
  }
}
