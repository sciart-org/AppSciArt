import { sequelize } from '../config/sequelize.js'
import { Edition } from './Edition.js'
import { Hackathon } from './Hackathon.js'
import { Seed } from './Seed.js'
import { Flower } from './Flower.js'
import { Fruit } from './Fruit.js'
import { UserProfile } from './UserProfile.js'
import { EarlySignup } from './EarlySignup.js'
import { Participation } from './Participation.js'

//  STRUCTURE

//  Edition.belongsTo(Methodology)
//  Methodology.hasMany(Edition)

Hackathon.belongsTo(Edition)
Edition.hasMany(Hackathon)

const SeedEditions = sequelize.define('seed_editions', {})

Seed.belongsToMany(Edition, { through: SeedEditions })
Edition.belongsToMany(Seed, { through: SeedEditions })

const HackathonSeeds = sequelize.define('hackathon_seeds', {})

Hackathon.belongsToMany(Seed, { through: HackathonSeeds })
Seed.belongsToMany(Hackathon, { through: HackathonSeeds })

const SeedLikes = sequelize.define('seed_likes', {})

Seed.belongsToMany(UserProfile, { through: SeedLikes })
UserProfile.belongsToMany(Seed, { through: SeedLikes })

//  ITEMS

Flower.belongsTo(Seed)
Seed.hasMany(Flower)

Fruit.belongsTo(Flower)
Flower.hasMany(Fruit)

Participation.belongsTo(Flower)
Participation.belongsTo(Fruit)
Participation.belongsTo(UserProfile)
Participation.belongsTo(Hackathon)
Flower.hasMany(Participation)
Fruit.hasMany(Participation)
UserProfile.hasMany(Participation)
Hackathon.hasMany(Participation)

//  const SeedScientists = sequelize.define('seed_scientists', {})

//  Seed.belongsToMany(InspiringScientist, { through: SeedScientists })
//  InspiringScientist.belongsToMany(Seed, { through: SeedScientists })

//  ROLES BELOW
