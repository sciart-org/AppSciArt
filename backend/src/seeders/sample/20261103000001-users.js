'use strict'

import { ACCOUNTS } from '../sampleData.js'
import { createAccount, deleteAccounts } from '../factories/accounts.js'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await Promise.all(ACCOUNTS.map(account => createAccount(queryInterface, account)))
}

export async function down (queryInterface, Sequelize) {
  await deleteAccounts(queryInterface, ACCOUNTS.map(account => account.email))
}
