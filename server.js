const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const dotenv = require("dotenv")
dotenv.config();

//Variables for like feature
let likedList = [];
let dislikedList = [];
let currentUser = [];

//Fake database, will change to mongoDB 
const users = [{
    "userID": 0,
    "firstname": "Pieter",
    "age": 20,
    "profilepicture": 'images/profilepicture1.jpeg',
    "musicGenre": "rap"
  },
  {
    "userID": 1,
    "firstname": "Jaap",
    "age": 23,
    "profilepicture": 'images/profile_img.png',
    "musicGenre": "pop"

  },
  {
    "userID": 2,
    "firstname": "Jip",
    "age": 25,
    "profilepicture": '/images/profilepicture2.jpeg',
    "musicGenre": "pop"
  },
  {
    "userID": 3,
    "firstname": "Geert",
    "age": 31,
    "profilepicture": '/images/profilepicture3.jpeg',
    "musicGenre": "pop"
  }

]
// function that checks what user is available from users and isnt included in likedList nor dislikedList
let availableUser = () => {
  for (let i = 0; i < users.length; i++) {
    if (
      !likedList.includes(users[i]) && !dislikedList.includes(users[i])
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

// renders main page.
app.get('/', (req, res) => {
  currentUser = availableUser();
  res.render('index', {
    user: currentUser
  });
});

// renders like list
app.get('/likelist', (req, res) => {
  res.render('likelist', {
    liked: likedList
  })
});

// renders profile page 
app.get('/profile', (req, res) => {
  res.render('profilepage')
});

// click on likebutton > pushes currentuser to likedlist
app.post('/like', (req, res) => {
  likedList.push(currentUser);
  currentUser = availableUser();
  res.render('index', {
    user: currentUser
  });
});

// click on dislikebutton > pushes currentuser to dislikelist
app.post('/dislike', (req, res) => {
  dislikedList.push(currentUser);
  currentUser = availableUser();
  res.render('index', {
    user: currentUser
  });
});

// error message when typed in wrong path
app.use(function (req, res) {
  res.status(404).send("I'm sorry but we couldn't find that page!")
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});