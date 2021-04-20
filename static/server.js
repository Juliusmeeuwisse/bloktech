const express = require('express')
const app = express()
const port = 3000

app.use(express.static('static/public'))


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/muziek', (req, res) => {
  res.send('Hello World!')
});

app.use(function(req, res, next ) {
  res.status(404).send("Sorry can't find that!")
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});