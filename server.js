const express = require('express')
const app = express()
const port = 3000

app.use(express.static('static/public'))


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/login', (req, res) => {
  res.send('The login to account page')
});

app.get('/signin', (req, res) => {
  res.send('The create account page')
});

app.get('/muziek', (req, res) => {
  res.send('Hello World!')
});

app.use(function(req, res, next ) {
  res.status(404).send("I'm sorry but we couldn't find that page!")
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});