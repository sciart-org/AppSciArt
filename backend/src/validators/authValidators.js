const validateEnumValues = (toValidate, possibleValues, property) => {
  if (!possibleValues.includes(toValidate)) {
    return 'Invalid value for property ' + property
  }
}

const validateEnumList = (toValidate, possibleValues, property) => {
  for (let v = 0; v < toValidate.length; v = v + 1) {
    validateEnumValues(toValidate[v], possibleValues, property)
    possibleValues.pop(toValidate[v])
  }
}

const validateGender = (gender) => {
  const acceptedGenders = ['male', 'female', 'other', 'prefer not to say']
  validateEnumValues(gender, acceptedGenders, 'gender')
}

const validateAffiliations = (affiliations) => {
  const acceptedAffiliations = ['university', 'company', 'association', 'freelance', 'other']
  validateEnumList(affiliations, acceptedAffiliations, 'affiliations')
}

const validateAreasOfInterest = (areasOfInterest) => {
  const acceptedAreas = ['art', 'pure sciences', 'science applications', 'it', 'Others']
  validateEnumList(areasOfInterest, acceptedAreas, 'areasOfInterest')
}

const authBodyValidator = (body) => {
  const { gender, affiliations, areasOfInterest } = body
  if (gender !== null) validateGender(gender)
  if (affiliations !== null) validateAffiliations(affiliations)
  if (areasOfInterest !== null) validateAreasOfInterest(areasOfInterest)
}

export { authBodyValidator }
