import { Edition } from './Edition.js'
import { Hackathon } from './Hackathon.js'
import { Seed } from './Seed.js'
import { Flower } from './Flower.js'
import { Fruit } from './Fruit.js'
import { UserProfile } from './UserProfile.js'
import { EarlySignup } from './EarlySignup.js'
import { Participation } from './Participation.js'
import { SeedEditions } from './intermediate/SeedEditions.js'
import { HackathonSeeds } from './intermediate/HackathonSeeds.js'
import { SeedLikes } from './intermediate/SeedLikes.js'
import { SeedScientists } from './intermediate/SeedScientists.js'
import { Administrator } from './roles/Administrator.js'
import { Designer } from './roles/Designer.js'
import { Evaluator } from './roles/Evaluator.js'
import { Facilitator } from './roles/Facilitator.js'
import { ConceptualMap } from './ConceptualMap.js'
import { ScientistEditions } from './intermediate/ScientistEditions.js'
import { ScientistInvitation } from './roles/ScientistInvitation.js'

const notNull = (attributeName) => {
  return {
    foreignKey: {
      allowNull: false,
      name: attributeName
    }
  }
}

//  STRUCTURE

//  Edition.belongsTo(Methodology)
//  Methodology.hasMany(Edition)

Hackathon.belongsTo(Edition)
Edition.hasMany(Hackathon, notNull('editionId'))

Seed.belongsToMany(Edition, { through: SeedEditions })
Edition.belongsToMany(Seed, { through: SeedEditions })

Hackathon.belongsToMany(Seed, { through: HackathonSeeds })
Seed.belongsToMany(Hackathon, { through: HackathonSeeds })

Seed.belongsToMany(UserProfile, {
  through: SeedLikes,
  as: 'LikedByUsers'
})

UserProfile.belongsToMany(Seed, {
  through: SeedLikes,
  as: 'LikedSeeds'
})

//  ITEMS

Flower.belongsTo(Seed)
Seed.hasMany(Flower, notNull('seedId'))

Fruit.belongsTo(Flower)
Flower.hasMany(Fruit, notNull('flowerId'))

ConceptualMap.hasMany(Participation, { foreignKey: 'groupId' })
Flower.hasMany(Participation, { foreignKey: 'teamId' })
Fruit.hasMany(Participation, { foreignKey: 'fruitId' })
UserProfile.hasMany(Participation, notNull('userProfileId'))
Hackathon.hasMany(Participation, notNull('hackathonId'))
Participation.belongsTo(ConceptualMap, { foreignKey: 'groupId' })
Participation.belongsTo(Flower, { foreignKey: 'teamId' })
Participation.belongsTo(Fruit, { foreignKey: 'fruitId' })
Participation.belongsTo(UserProfile, notNull('userProfileId'))
Participation.belongsTo(Hackathon, notNull('hackathonId'))

ConceptualMap.belongsTo(Seed)
Seed.hasMany(ConceptualMap, notNull('seedId'))

Seed.belongsToMany(UserProfile, { through: SeedScientists })
UserProfile.belongsToMany(Seed, { through: SeedScientists })

Edition.belongsToMany(UserProfile, { through: ScientistEditions })
UserProfile.belongsToMany(Edition, { through: ScientistEditions })

//  ROLES BELOW

UserProfile.hasOne(Administrator, notNull('userProfileId'))
Administrator.belongsTo(UserProfile)

UserProfile.hasOne(Facilitator, notNull('userProfileId'))
Facilitator.belongsTo(UserProfile)
// Facilitator.belongsTo(Methodology)
// Methodology.hasMany(Facilitator)

UserProfile.hasOne(Evaluator, notNull('userProfileId'))
Evaluator.belongsTo(UserProfile)
// Evaluator.belongsTo(Methodology)
// Methodology.hasMany(Evaluator)

UserProfile.hasOne(Designer, notNull('userProfileId'))
Designer.belongsTo(UserProfile)
// Designer.belongsTo(Methodology)
// Methodology.hasMany(Designer)

ScientistInvitation.belongsTo(Seed)
Seed.hasMany(ScientistInvitation)

ScientistInvitation.belongsTo(Edition)
Edition.hasMany(ScientistInvitation, notNull('editionId'))
