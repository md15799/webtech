const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const session = require('express-session')
const api = require('./api/index.js')
const app = express()
const Cookie = require('js-cookie')
const { Seq, User } = require('./db')

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// Body parser, to access `req.body`
app.use(bodyParser.json())

// Sessions to create `req.session`
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}))

app.set('port', port)

app.use('/api', api)

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console


// const express = require('express')
// const bodyParser = require('body-parser')
// const Sequelize = require('sequelize');
// const app = express()
// const nuxt = new Nuxt(config)
//
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//   extended: true
// }))
//
// app.use((req, res, next) => {
// 	let router = express.Router()
// 	require('./server/index.js')(router)
// 	router(req, res, next)
// })
// app.use(nuxt.render)
//
// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: 'sqlite',
//   operatorsAliases: false,
//
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },
//
//   // SQLite only
//   storage: 'db.sqlite'
// });
//
//
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });
