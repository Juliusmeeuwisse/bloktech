const express = require('express')
const app = express()
const port = 3000
const dotenv = require("dotenv")
dotenv.config();

let currentUser = [];
let likedList = [];
let dislikedList = [];


let profile = {
  firstname: "testsubject",
  age: 19,
}

const users = [{
    "userID": 0,
    "firstname": "Pieter",
    "age": 20,
    "Muziekgenre": "rap"
  },
  {
    "userID": 1,
    "firstname": "Jaap",
    "age": 23,
    "Muziekgenre": "pop"
  }

]

getUserProfile = (userID) => {
  console.log('User profile ID ${userID}')
  return users[userID - 1];
}
AvailableUser = () => {
  for (let i = 0; i < users.length; i++) {
    if (
      !likedList.includes(users[i]) &&
      !dislikedList.includes(users[i])
    ) {
      return users[i]
    }
  }
  return null;
}

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
app.set('view engine', 'ejs');

//Renders main page.
app.get('/', (req, res) => {
  currentUser = AvailableUser();
  res.render('index', {
    user: currentUser
  });
});

app.get('/matches', (req, res) => {
  res.send('The main page with all matches')
});

app.get('/likelist', (req, res) => {
  res.render('likelist')
});

app.get('/profile', (req, res) => {
  res.render('profilepage')
});


app.post('/like', (req, res) => {
  console.log("hi")
  likedList.push(currentUser)
  res.redirect('/')
  currentUser = AvailableUser();
});

app.use(function (req, res, next) {
  res.status(404).send("I'm sorry but we couldn't find that page!")
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});