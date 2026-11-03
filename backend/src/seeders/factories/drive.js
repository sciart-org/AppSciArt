const DRIVE_FOLDER_ID_PATTERN = /folders\/([-\w]+)/

export const driveService = () => import('../../services/driveService.js')

export const driveLinkOf = async (queryInterface, table, id) => {
  const [[row]] = await queryInterface.sequelize.query(
    `SELECT "driveLink" FROM ${table} WHERE "id" = :id`,
    { replacements: { id } }
  )
  return row?.driveLink
}

export const deleteDriveFolderOf = async (queryInterface, table, id) => {
  const driveLink = await driveLinkOf(queryInterface, table, id)
  const { deleteDriveFolder } = await driveService()
  await deleteDriveFolder(driveLink?.match(DRIVE_FOLDER_ID_PATTERN)?.[1])
}
