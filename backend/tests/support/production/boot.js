import { assertAppUsesFakes, redirectThirdPartyServicesToFakes } from '../native.js'

redirectThirdPartyServicesToFakes()
await import('googleapis')
await import('resend')
assertAppUsesFakes()

console.log(`productionApp: NODE_ENV=${process.env.NODE_ENV}, FRONTEND_URL=${process.env.FRONTEND_URL ?? '(unset)'}, fake Google and Resend in place`)
