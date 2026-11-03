const FAKE_MODULE_BY_PACKAGE = {
  googleapis: new URL('./googleapis.js', import.meta.url).href,
  resend: new URL('./resend.js', import.meta.url).href
}

export async function resolve (specifier, context, nextResolve) {
  const fakeModule = FAKE_MODULE_BY_PACKAGE[specifier]
  if (fakeModule) return { url: fakeModule, shortCircuit: true }
  return nextResolve(specifier, context)
}
