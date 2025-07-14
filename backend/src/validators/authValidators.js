import { checkExists } from './generalValidators.js'

const validateEnumValues = (toValidate, possibleValues, property) => {
  if (!possibleValues.includes(toValidate)) {
    return 'Invalid value for property ' + property
  }
}

const validateEnumList = (toValidate, possibleValues, property) => {
  let errorMessage = null

  for (let v = 0; v < toValidate.length; v = v + 1) {
    if (checkExists(errorMessage)) break
    errorMessage = validateEnumValues(toValidate[v], possibleValues, property)
    possibleValues.pop(toValidate[v])
  }

  return errorMessage
}

const validateGender = (gender) => {
  const acceptedGenders = ['MALE', 'FEMALE', 'OTHER']
  return validateEnumValues(gender, acceptedGenders, 'gender')
}

const validateAffiliations = (affiliations) => {
  const acceptedAffiliations = ['UNIVERSITY', 'COMPANY', 'ASSOCIATION', 'FREELANCE', 'OTHER']
  return validateEnumList(affiliations, acceptedAffiliations, 'affiliations')
}

const validateAreasOfInterest = (areasOfInterest) => {
  const acceptedAreas = ['ART', 'PURE SCIENCES', 'SCIENCE APPLICATIONS', 'IT', 'OTHER']
  return validateEnumList(areasOfInterest, acceptedAreas, 'areasOfInterest')
}

const authBodyValidator = (body) => {
  const { gender, affiliations, areasOfInterest } = body
  let errorMessage = null

  if (checkExists(gender)) {
    errorMessage = validateGender(gender)
  }
  if (!checkExists(errorMessage) && checkExists(affiliations)) {
    errorMessage = validateAffiliations(affiliations)
  }
  if (!checkExists(errorMessage) && checkExists(areasOfInterest)) {
    errorMessage = validateAreasOfInterest(areasOfInterest)
  }

  return errorMessage
}

export { authBodyValidator }
