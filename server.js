const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs');

app.use(express.static('static/public'))
app.use(express.json());
app.use(express.urlencoded());
app.set ('view engine' , 'ejs');

let music = ["Rap" , "R&B", "Pop"]

app.get('/', (req, res) => {
  let musicrandom = music[Math.floor(Math.random() * music.length)];
  res.render('index', {musicrandom});
});

app.get('/matches', (req, res) => {
  res.send('The main page with all matches')
});

app.get('/likedlist', (req, res) => {
  res.send('List with all your likes')
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