const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')

const PORT = 3000
const app = express()

app.get('/', (req, res) => {
  console.log(req.cookies);
  const first = req.cookies
  const last = undefined

  if (first) {
    let fromThen = Date.now() - from
    res.send(`pierwszy raz byłeś na naszej stronie ${parseInt(fromThen * 1000)} minut ${parseInt(fromThen * 1000)} sekund temu`)
  }
  else {
    res.cookie(
      'first',
      Date.now(),
    )
  }

  if (last)
    res.send(`ostatni raz byłeś na naszej stronie ${last.min} minut ${last.sec} sekund temu`)

  res.cookie(
    'last',
    Date.now(),
  )
  
  res.send('witaj!')
})

app.use(cookieParser())
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})