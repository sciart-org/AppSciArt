import { Administrator } from '../models/roles/Administrator.js'
import { Designer } from '../models/roles/Designer.js'
import { Evaluator } from '../models/roles/Evaluator.js'
import { Facilitator } from '../models/roles/Facilitator.js'
import { checkHasRole } from '../validators/userValidators.js'

export const INTERNAL_ROLES = {
  ADMIN: { name: 'admin', models: [Administrator] },
  DESIGNER: { name: 'designer', models: [Designer] },
  FACILITATOR: { name: 'facilitator', models: [Facilitator] }
}

export const ROLES = {
  STAFF: { name: 'staff', models: [Administrator, Designer, Facilitator] },
  EVALUATOR: { name: 'evaluator', models: [Evaluator] },
  PUBLIC: { name: 'public', models: [] },
  SCIENTIST: { name: 'inspiring_scientist', models: [] }
}

export const INTERNAL_BACKEND_ROLE = {
  name: 'staff'
}

export const getUserRole = async (userId, { hackathonId } = {}) => {
  if (!userId) return ROLES.PUBLIC
  const [isStaff, isEvaluator] = await Promise.all([
    checkHasRole(userId, ROLES.STAFF),
    checkHasRole(userId, ROLES.EVALUATOR, { hackathonId })
  ])
  if (isStaff) return ROLES.STAFF
  if (isEvaluator) return ROLES.EVALUATOR
  return ROLES.PUBLIC
}
