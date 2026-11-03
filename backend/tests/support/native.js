import { register } from 'module'
import { pathToFileURL } from 'url'
import path from 'path'

const SRC_DIR = path.resolve(import.meta.dirname, '../../src')
const FAKED_SERVICES = ['googleapis', 'resend']

let redirected = false

export const redirectThirdPartyServicesToFakes = () => {
  if (redirected) return
  register('./fakes/hooks.js', import.meta.url)
  redirected = true
}

export const importFromSrc = (file) => import(pathToFileURL(path.join(SRC_DIR, file)).href)

export const stateSharedWithApp = (key, createInitialState) => {
  globalThis.__appsciartFakes ??= {}
  globalThis.__appsciartFakes[key] ??= createInitialState()
  return globalThis.__appsciartFakes[key]
}

export const fakesLoadedByApp = () => stateSharedWithApp('fakesLoadedByApp', () => new Set())

export const markFakeLoadedByApp = (service) => fakesLoadedByApp().add(service)

export const assertAppUsesFakes = () => {
  for (const service of FAKED_SERVICES) {
    if (!fakesLoadedByApp().has(service)) {
      throw new Error(`The app did not load the fake "${service}"; refusing to run against the real service.`)
    }
  }
}
