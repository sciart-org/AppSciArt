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
import { InspiringScientist } from './roles/InspiringScientist.js'
import { Administrator } from './roles/Administrator.js'
import { Designer } from './roles/Designer.js'
import { Evaluator } from './roles/Evaluator.js'
import { Facilitator } from './roles/Facilitator.js'

const unique = {
  foreignKey: {
    allowNull: false
  }
}

//  STRUCTURE

//  Edition.belongsTo(Methodology)
//  Methodology.hasMany(Edition)

Hackathon.belongsTo(Edition)
Edition.hasMany(Hackathon, unique)

Seed.belongsToMany(Edition, { through: SeedEditions })
Edition.belongsToMany(Seed, { through: SeedEditions })

Hackathon.belongsToMany(Seed, { through: HackathonSeeds })
Seed.belongsToMany(Hackathon, { through: HackathonSeeds })

Seed.belongsToMany(UserProfile, { through: SeedLikes })
UserProfile.belongsToMany(Seed, { through: SeedLikes })

//  ITEMS

Flower.belongsTo(Seed)
Seed.hasMany(Flower, unique)

Fruit.belongsTo(Flower)
Flower.hasMany(Fruit, unique)

Participation.belongsTo(Flower)
Participation.belongsTo(Fruit)
Participation.belongsTo(UserProfile)
Participation.belongsTo(Hackathon)
Flower.hasMany(Participation)
Fruit.hasMany(Participation)
UserProfile.hasMany(Participation, unique)
Hackathon.hasMany(Participation, unique)

Seed.belongsToMany(InspiringScientist, { through: SeedScientists })
InspiringScientist.belongsToMany(Seed, { through: SeedScientists })

//  ROLES BELOW

UserProfile.hasOne(Administrator, unique)
Administrator.belongsTo(UserProfile)

UserProfile.hasOne(Facilitator, unique)
Facilitator.belongsTo(UserProfile)
// Facilitator.belongsTo(Methodology)
// Methodology.hasMany(Facilitator)

UserProfile.hasOne(InspiringScientist, unique)
InspiringScientist.belongsTo(UserProfile)
// InspiringScientist.belongsTo(Methodology)
// Methodology.hasMany(InspiringScientist)

UserProfile.hasOne(Evaluator, unique)
Evaluator.belongsTo(UserProfile)
// Evaluator.belongsTo(Methodology)
// Methodology.hasMany(Evaluator)

UserProfile.hasOne(Designer, unique)
Designer.belongsTo(UserProfile)
// Designer.belongsTo(Methodology)
// Methodology.hasMany(Designer)
