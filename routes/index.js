const express = require('express')
const router = express.Router()
const home = require('./modlules/home')

router.use('/', home)

module.exports = router