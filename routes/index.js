const express = require('express')
const router = express.Router()

const home = require('./modlules/home')
const shortener = require('./modlules/shortener')

router.use('/', home)
router.use('/shorten', shortener)

module.exports = router