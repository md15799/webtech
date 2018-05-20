const express = require('express')
const auth = require('./auth.js')
const project = require('./project.js')
const router = express.Router()
const { Seq, User } = require('../db')

router.use('/auth', auth)
router.use('/project', project)

module.exports = router
