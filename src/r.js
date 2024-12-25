import { reactive, raw, effect } from '@/lib/el/index.js'
import { ActiveState } from '@/lib/active-state.js'
import { Audio, setAudioVolume } from '@/lib/audio.js'
import bin from '@/lib/bin.js'

const localStorageKey = 'fire-seeker'

export const activeState = new ActiveState()

export const store = reactive({
  isMute: false,
  areaKey: '3x3',
  moves: {},
  help: {},
  ...safeJsonParse(localStorage.getItem(localStorageKey)),
})

effect(() => {
  localStorage.setItem(localStorageKey, JSON.stringify(store))
})

export const state = reactive({
  isPlay: false,
  ...history.state,
})

history.replaceState(raw(state), '')

export function pushState(newState) {
  Object.assign(state, newState)
  history.pushState(newState, '')
}

addEventListener('popstate', () => {
  Object.assign(state, { ...history.state })
})

export const bgm = {
  title: new Audio(bin('title.mp3'), {
    volume: 0.2,
    loop: true,
  }),
  play: new Audio(bin('play.mp3'), {
    volume: 0.2,
    loop: {
      start: 10.578,
      end: 69.354,
    },
  }),
}

export const se = {
  clear1: new Audio(bin('clear1.mp3'), { volume: 0.2 }),
  clear2: new Audio(bin('clear2.mp3'), { volume: 0.5 }),
  click: new Audio(bin('click.mp3'), { volume: 0.5 }),
  move: new Audio(bin('move.mp3'), { volume: 1.8 }),
  start: new Audio(bin('start.mp3'), { volume: 0.5 }),
}

export const maxVolume = 0.7

activeState.on((state) => {
  setAudioVolume(state && !store.isMute ? maxVolume : 0)
})

function safeJsonParse(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}
