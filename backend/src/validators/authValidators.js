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
    const index = possibleValues.indexOf(toValidate[v])
    if (index > -1) possibleValues.splice(index, 1)
  }

  return errorMessage
}

const validateGender = (gender) => {
  const acceptedGenders = ['MALE', 'FEMALE', 'OTHER']
  return validateEnumValues(gender, acceptedGenders, 'gender')
}

const validateAgeRange = (ageRange) => {
  const acceptedAgeRanges = ['17_OR_LESS', '18_24', '25_34', '35_44', '45_54', '55_64', '65_OR_MORE']
  return validateEnumValues(ageRange, acceptedAgeRanges, 'age range')
}

const validateAffiliations = (affiliations) => {
  const acceptedAffiliations = ['UNIVERSITY', 'COMPANY', 'ASSOCIATION', 'FREELANCE', 'OTHER']
  return validateEnumList(affiliations, acceptedAffiliations, 'affiliations')
}

const validateAreasOfInterest = (areasOfInterest) => {
  const acceptedAreas = ['ART', 'PURE_SCIENCES', 'SCIENCE_APPLICATIONS', 'IT', 'OTHER']
  return validateEnumList(areasOfInterest, acceptedAreas, 'areasOfInterest')
}

const authBodyValidator = (body) => {
  const { gender, affiliations, areasOfInterest, ageRange } = body
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
  if (!checkExists(errorMessage) && checkExists(ageRange)) {
    errorMessage = validateAgeRange(ageRange)
  }

  return errorMessage
}

export { authBodyValidator }
