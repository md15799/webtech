const express = require('express')
const { Seq, User, Product } = require('../db')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//Add POST - /api/login
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  if (!email || !password) {
    res.status(400).json({  type: 'error', message: 'email and password fields are essential for authentication.'})
  }
  User.findOne( { where: { email: email } } ).then( (user) => {
    if(user == null) {
      res.status(401)
             .json({ type: 'error',
                     message: 'User with provided email not found in database.'
                   })
    }
    else {
      bcrypt.compare(password, user.password, (error, result) => {
        if (error) return res.status(500).json({type: 'error', message: 'bcrypt error', error})
        if(result) {
          Product.findAll( {where:{ userId: user.id }}).then((products) => {
            req.session.authUser = {id: user.id, email: user.email, projects: products}
            res.json({id: user.id, email: user.email, name: user.firstName})
          })
        }
        else res.status(401).json({type: 'error', message: 'Password is incorrect.'})
      })
    }
  })
})

// Add POST - /api/register
// User.findOrCreate( { where: { email: email } } ).spread( (results, metadata) => {
//   console.log(results.isNewRecord)
// })
router.post('/register', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const first = req.body.first
  const last = req.body.last
  if (!email || !password) {
    res.status(400).json({  type: 'error', message: 'email and password fields are essential for authentication.'})
  }
  User.findOne( { where: { email: email } } ).then( (user) => {
    if(user == null) {
      User.create({
        email: email,
        password: password,
        firstName: first,
        lastName: last
      }).then((user) => {
        req.session.authUser = { email: email }
        res.json({id: user.id, email: user.email, name: user.firstName})
      }).catch(() =>{
        return res.status(401).json({type: 'error', message: 'Account with that email address already exists.'})
      })
    }
    else {
      return res.status(401).json({type: 'error', message: 'Account with that email address already exists.'})
    }
  })
})

// Add POST - /api/logout
router.post('/logout', (req, res) => {
  delete req.session.authUser
  res.json({ ok: true })
})

module.exports = router;
