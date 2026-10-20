import { describe, expect, it } from 'vitest'
import { fakesLoadedByApp, importFromSrc } from '../support/native.js'
import { driveFiles } from '../support/index.js'

describe('fake third-party services', () => {
  it('the app loaded the fake Google APIs and the fake Resend instead of the real ones', () => {
    expect([...fakesLoadedByApp()].sort()).toEqual(['googleapis', 'resend'])
  })

  it("files created through the app's Drive client land in the fake Drive the tests inspect", async () => {
    const { loadDriveAuthConfig } = await importFromSrc('config/drive.js')
    const appDriveClient = await loadDriveAuthConfig()

    const { data: created } = await appDriveClient.files.create({ requestBody: { name: 'created-by-the-app' } })

    expect(driveFiles()).toContainEqual(expect.objectContaining({ id: created.id, name: 'created-by-the-app' }))
  })
})
