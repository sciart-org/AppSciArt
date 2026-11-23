import { describe, expect, it } from 'vitest'
import { fakesLoadedByApp, importFromSrc } from '../support/native.js'
import { driveFiles, restoreDriveAccess, revokeDriveAccess } from '../support/index.js'
import { resetDrive } from '../support/fakes/driveStore.js'

const appDriveClient = async () => {
  const { loadDriveAuthConfig } = await importFromSrc('config/drive.js')
  return loadDriveAuthConfig()
}

const EXPIRED_GRANT = { response: expect.objectContaining({ status: 400, data: expect.objectContaining({ error: 'invalid_grant' }) }) }

describe('fake third-party services', () => {
  it('the app loaded the fake Google APIs and the fake Resend instead of the real ones', () => {
    expect([...fakesLoadedByApp()].sort()).toEqual(['googleapis', 'resend'])
  })

  it("files created through the app's Drive client land in the fake Drive the tests inspect", async () => {
    const { data: created } = await (await appDriveClient()).files.create({ requestBody: { name: 'created-by-the-app' } })

    expect(driveFiles()).toContainEqual(expect.objectContaining({ id: created.id, name: 'created-by-the-app' }))
  })

  it("while Drive access is revoked, the app's Drive client fails the way Google does for an expired grant", async () => {
    const client = await appDriveClient()
    revokeDriveAccess()

    await expect(client.files.list({})).rejects.toMatchObject(EXPIRED_GRANT)
    restoreDriveAccess()
    await expect(client.files.list({})).resolves.toBeDefined()
  })

  it('resetting the fake Drive gives the app its Drive access back', async () => {
    const client = await appDriveClient()
    revokeDriveAccess()

    resetDrive()

    await expect(client.files.list({})).resolves.toBeDefined()
  })
})
