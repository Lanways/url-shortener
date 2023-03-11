const express = require('express')
const Link = require('./models/link')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

if (process.env.NODE_ENW !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MOGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const app = express()

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/shorten', (req, res) => {

  console.log('req.body', req.body)
  const { originalUrl } = req.body

  Link.findOne({ originalUrl })
    .lean()
    .then(data => {
      if (data) {
        return res.render('new', { shortUrl: data.shortUrl })
      } else {
        const shortUrl = 'http://localhost:3000/shorten/' + random_URL()
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

app.get('/shorten/:shortUrl', (req, res) => {
  console.log('req.params', req.params)
  const shortUrl = 'http://localhost:3000/shorten/' + req.params.shortUrl

  Link.findOne({ shortUrl })
    .then(data => {
      console.log(data.originalUrl)
      if (!data) res.send(`<script>alert(Can't found the URL)</script>`)
      res.redirect(data.originalUrl)
    })
})


app.listen(3000, () => {
  console.log('Express is running on http://localhost3000')
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