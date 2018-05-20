const sqlite = require('sqlite3')
const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  storage: './db.sqlite'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const TransportMode = sequelize.define('transportMode' , {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
    allowNull: false
  },
  mode: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  milesPerGallon: {
    type: Sequelize.DOUBLE,
    unique: false,
    allowNull: false
  }
})

const EnergySource = sequelize.define('energySource' , {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
    allowNull: false
  },
  source: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  co2_emissions: {
    type: Sequelize.DOUBLE,
    unique: false,
    allowNull: false
  },
  unit: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: false
  }
})

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  production_location: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: true
  },
  functional_unit: {
    type: Sequelize.DOUBLE,
    unique: false,
    allowNull: false,
    defaultValue: 1
  },
  units: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: false,
    defaultValue: ''
  },
  waste: {
    type: Sequelize.BOOLEAN,
    unique: false,
    allowNull: false,
    defaultValue: true
  },
  miles: {
    type: Sequelize.DOUBLE,
    unique: false,
    allowNull: false,
    defaultValue: 0
  },
  energy: {
    type: Sequelize.DOUBLE,
    unique: false,
    allowNull: false,
    defaultValue: 0
  },
  unitsPerLoad: {
    type: Sequelize.INTEGER,
    unique: false,
    allowNull: false,
    defaultValue: 1
  }
})

const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false
    }
});

const InputProducts = sequelize.define('inputProducts', {
    quantity: {
      type: Sequelize.FLOAT,
      unique: false
    }
});

const OutputProducts = sequelize.define('outputProducts', {
    quantity: {
      type: Sequelize.FLOAT,
      unique: false
    }
});

// Product.hasMany(Process, {as: 'processes', foreignKey: 'projectId'})
User.Projects = User.hasMany(Product, {as: 'projects'})
Product.Input = Product.belongsToMany(Product, { as: 'Input',
                                                  through: {
                                                    model: 'inputProducts',
                                                    unique: false
                                                  },
                                                  foreignKey: 'projectId',
                                                  otherKey: 'inputId' } )

Product.Output = Product.belongsToMany(Product, { as: 'Output',
                                                  through: {
                                                    model: 'outputProducts',
                                                    unique: false
                                                  },
                                                  foreignKey: 'projectId',
                                                  otherKey: 'outputId'})

TransportMode.EnergySource = TransportMode.belongsTo(EnergySource)
Product.EnergySource = Product.belongsTo(EnergySource)
Product.TransportMode = Product.belongsTo(TransportMode)
// Product.Transport = Product.hasOne(Transport, {as: 'transport'})
// Product.Energy = Product.hasMany(Energy, {as: 'energy'})

User.beforeCreate((user, options) => {

    return bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
        })
        .catch(err => {
            throw new Error();
        });
});

sequelize.sync({force:true}).then(async ()=>{
  const user = await User.create({
    firstName: 'maddie',
    lastName: 'darbyshire',
    email: 'maddie@email.com',
    password: 'dog'
  })
  const petrol = await EnergySource.create({
    source: 'Petrol',
    co2_emissions: 10.5,
    unit: 'gallon'
  })
  const lorry_25t = await TransportMode.create({
    mode: 'Lorry (Over 25t)',
    milesPerGallon: 6.5,
    energySourceId: petrol.id
  })
  const lorry_17t = await TransportMode.create({
    mode: 'Lorry (18t-25t)',
    milesPerGallon: 6.5,
    energySourceId: petrol.id
  })
  const lorry_14t = await TransportMode.create({
    mode: 'Lorry (15t-17t)',
    milesPerGallon: 6.5,
    energySourceId: petrol.id
  })
  const lorry_7t = await TransportMode.create({
    mode: 'Lorry (7.6t-14t)',
    milesPerGallon: 6.5,
    energySourceId: petrol.id
  })
  const lorry_3t = await TransportMode.create({
    mode: 'Lorry (3.5t-7.5t)',
    milesPerGallon: 6.5,
    energySourceId: petrol.id
  })
  const standard = await EnergySource.create({
    source: 'UK Standard Fuel Mix',
    co2_emissions: 43,
    unit: 'kWh'
  })
  const newspaper = await Product.create({
    name: 'newspaper',
    userId: user.id,
    functional_unit: 1,
    units: 'paper',
    waste: false,
    miles: 0,
    energy: 2,
    energySourceId: standard.id,
    transportModeId: lorry_7t.id
  })
  const paper = await Product.create({
    name: 'paper',
    userId: user.id,
    waste: false,
    functional_unit: 1,
    units: 'sheet',
    production_location: 'paper factory',
    miles: 100,
    energy: 0.06,
    energySourceId: standard.id,
    transportModeId: lorry_7t.id,
    unitsPerLoad: 10000
  })
  const ink = await Product.create({
    name: 'ink',
    unitsPerLoad: 1000,
    functional_unit: 500,
    units: 'ml',
    waste: false,
    miles: 30,
    energy: 40,
    energySourceId: standard.id,
    transportModeId: lorry_7t.id
  })
  const sludge = await Product.create({
    name: 'sludge',
    unitsPerLoad: 1000,
    functional_unit: 1,
    units: 'kg',
    waste: true,
    energy: 0,
    energySourceId: standard.id,
    transportModeId: lorry_7t.id
  })
  const tree = await Product.create({
    name: 'tree',
    miles: 100,
    energy: 100,
    waste: false,
    functional_unit: 1,
    units: 'tree',
    energySourceId: standard.id,
    transportModeId: lorry_7t.id,
    unitsPerLoad: 0.5
  })

  await paper.addInput(tree, { through: { quantity: 0.0001200048 }})
  await newspaper.addInput(paper, { through: { quantity: 24 } } )
  await newspaper.addInput(ink, { through: { quantity: 0.001 } } )
  await newspaper.addOutput(sludge, { through: { quantity: 0.01 } } )

})

module.exports = {
  Seq: sequelize,
  User: User,
  Product: Product,
  TransportMode: TransportMode,
  EnergySource: EnergySource,
  InputProducts: InputProducts
};
