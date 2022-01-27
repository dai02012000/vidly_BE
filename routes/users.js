const { User, validate } = require('../models/user');
const _ = require('lodash');
const auth = require('../middleware/auth')
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.send(user)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send("Email already exists ")

  user = new User(_.pick(req.body, ['name', 'email', 'password']))

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt);

  const token = user.generateAuthToken();

  await user.save()

  res
    .header('x-auth-token', token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ['_id', 'name', 'email']))
})

module.exports = router