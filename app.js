const express = require('express')
const Link = require('./models/link')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
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

app.get('/', (req, res) => {
  res.render('index')
})
app.listen(3000, () => {
  console.log('Express is running on http://localhost3000')
})