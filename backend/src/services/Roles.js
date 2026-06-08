import { Administrator } from '../models/roles/Administrator.js'
import { Designer } from '../models/roles/Designer.js'
import { Evaluator } from '../models/roles/Evaluator.js'
import { Facilitator } from '../models/roles/Facilitator.js'
import { checkHasRole } from '../validators/userValidators.js'
import { ROLE_SCOPE_NAMES } from './RoleScopeNames.js'

export const INTERNAL_ROLES = {
  ADMIN: { name: 'admin', models: [Administrator] },
  DESIGNER: { name: 'designer', models: [Designer] },
  FACILITATOR: { name: 'facilitator', models: [Facilitator] }
}

export const ROLES = {
  STAFF: { name: ROLE_SCOPE_NAMES.STAFF, models: [Administrator, Designer, Facilitator] },
  EVALUATOR: { name: ROLE_SCOPE_NAMES.EVALUATOR, models: [Evaluator] },
  PUBLIC: { name: ROLE_SCOPE_NAMES.PUBLIC, models: [] },
  SCIENTIST: { name: ROLE_SCOPE_NAMES.SCIENTIST, models: [] },
  PARTICIPANT: { name: ROLE_SCOPE_NAMES.PARTICIPANT, models: [] }
}

export const INTERNAL_BACKEND_ROLE = {
  name: 'staff'
}

export const getUserRole = async (userId, { hackathonId, editionId } = {}) => {
  if (!userId) return ROLES.PUBLIC
  const [isStaff, isEvaluator, isScientist, isParticipant] = await Promise.all([
    checkHasRole(userId, ROLES.STAFF),
    checkHasRole(userId, ROLES.EVALUATOR, { hackathonId }),
    checkHasRole(userId, ROLES.SCIENTIST, { editionId }),
    checkHasRole(userId, ROLES.PARTICIPANT, { hackathonId })
  ])
  if (isStaff) return ROLES.STAFF
  if (isEvaluator) return ROLES.EVALUATOR
  if (isScientist) return ROLES.SCIENTIST
  if (isParticipant) return ROLES.PARTICIPANT
  return ROLES.PUBLIC
}
