const validateEnumValues = (toValidate, possibleValues, property, res) => {
  if (!possibleValues.includes(toValidate)) {
    res.status(400).send({ error: 'Invalid value for property ' + property })
  }
}

const validateEnumList = (toValidate, possibleValues, property, res) => {
  for (let v = 0; v < toValidate.length; v = v + 1) {
    validateEnumValues(toValidate[v], possibleValues, property, res)
    possibleValues.pop(toValidate[v])
  }
}

const validateGender = (gender, res) => {
  const acceptedGenders = ['male', 'female', 'other', 'prefer not to say']
  validateEnumValues(gender, acceptedGenders, 'gender', res)
}

const validateAffiliations = (affiliations, res) => {
  const acceptedAffiliations = ['university', 'company', 'association', 'freelance', 'other']
  validateEnumList(affiliations, acceptedAffiliations, 'affiliations', res)
}

const validateAreasOfInterest = (areasOfInterest, res) => {
  const acceptedAreas = ['art', 'pure sciences', 'science applications', 'it', 'Others']
  validateEnumList(areasOfInterest, acceptedAreas, 'areasOfInterest', res)
}

const authBodyValidator = (req, res) => {
  const { gender, affiliations, areasOfInterest } = req.body
  if (gender !== null) validateGender(gender, res)
  if (affiliations !== null) validateAffiliations(affiliations, res)
  if (areasOfInterest !== null) validateAreasOfInterest(areasOfInterest, res)
}

export { authBodyValidator }
