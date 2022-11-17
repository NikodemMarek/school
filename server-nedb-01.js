const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')
const Datastore = require('nedb')

const PORT = 3000
const app = express()
app.use(express.urlencoded({ extended: true }))

const carsDB = new Datastore({
  filename: path.join('db', 'cars.db'),
  autoload: true,
})

const fields = [ 'ubez', 'benz', 'uszk', '4k' ]

app.get('/', (req, res) => {
  res.render('index-nedb-01.hbs', {})
})
app.post('/add', (req, res) => {
  const doc = fields
    .reduce((acc, field) =>
      ({ ... acc, [field]: req.body[field] === 'on'}), {})

  carsDB.insert(doc, (e, doc) => console.log(e || doc))

  carsDB.find({}, (e, cars) => {
    if (e) 
      res.send(e)
    else
      res.render('index-nedb-01.hbs', { cars })
  })
})
app.post('/remove', (req, res) => {
  console.log(req.body)
  const { _id } = req.body
  console.log(_id)
  carsDB.remove({ _id }, (e, doc) => console.log(e || doc))

  carsDB.find({}, (e, cars) => {
    if (e) 
      res.send(e)
    else
      res.render('index-nedb-01.hbs', { cars })
  })
})

app.set('views', path.join(__dirname, `views`))
app.engine('hbs', hbs({
  defaultLayout: 'main.hbs',
  extname: '.hbs',
  partialsDir: 'views/partials',
}))
app.set('view engine', 'hbs')

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
