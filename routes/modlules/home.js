const express = require('express')
const router = express.Router()
const Link = require('../../models/link')

router.get('/', (req, res) => {
  res.render('index')
})

function random_URL() {
  let words = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let randomNumber = ''

  for (let i = 0; i < 5; i++) {
    let index = Math.floor(Math.random() * words.length)
    randomNumber += words[index]
  }
  return randomNumber
}

router.post('/', (req, res) => {
  console.log('req.body', req.body)
  const { originalUrl } = req.body

  Link.findOne({ originalUrl })
    .lean()
    .then(data => {
      if (data) {
        return res.render('new', { shortUrl: data.shortUrl })
      } else {
        const shortUrl = 'http://localhost:3000/' + random_URL()
        const link = new Link({
          originalUrl: originalUrl,
          shortUrl: shortUrl
        })
        return link.save()
          .then(() => res.render('new', { shortUrl: shortUrl }))
          .catch((error) => console.log(error))
      }
    })
})

router.get('/:shortUrl', (req, res) => {
  console.log('req.params', req.params)
  const shortUrl = 'http://localhost:3000/' + req.params.shortUrl

  Link.findOne({ shortUrl })
    .then(data => {
      console.log(data.originalUrl)
      if (!data) res.send(`<script>alert(Can't found the URL)</script>`)
      res.redirect(data.originalUrl)
    })
})


module.exports = router