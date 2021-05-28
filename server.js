const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

//Variables for like feature
let likedList = [];
let dislikedList = [];
let currentUser = [];
let useraccount = [];

let db = null;
// is collection van db.collection('profile)
let users = null;
let users2 = null;
// function connectDB
async function connectDB () {
  // get URI from .env file
  const uri = process.env.DB_URI
  // make connection to database
  const options = { useUnifiedTopology: true };
  const client = new MongoClient(uri, options)
  await client.connect();
  db = await client.db(process.env.DB_NAME)
  users = db.collection('profiles')
  users2 = db.collection('account')

}

connectDB()
  .then(() => {
    // if succesfull connection is made, show a message
    console.log('Connection to MongoDB succesfull')
  })
  .catch( error => {
    // if connnection is unsuccesful, show errors
    console.log(error)
  });

// Fake database, will change to mongoDB 
// const users = [{
//     "userID": 0,
//     "firstname": "Pieter",
//     "age": 20,
//     "profilepicture": 'images/profilepicture1.jpeg',
//     "musicGenre": "rap"
//   },
//   {
//     "userID": 1,
//     "firstname": "Jaap",
//     "age": 23,
//     "profilepicture": 'images/profile_img.png',
//     "musicGenre": "pop"

//   },
//   {
//     "userID": 2,
//     "firstname": "Jip",
//     "age": 25,
//     "profilepicture": '/images/profilepicture2.jpeg',
//     "musicGenre": "pop"
//   },
//   {
//     "userID": 3,
//     "firstname": "Geert",
//     "age": 31,
//     "profilepicture": '/images/profilepicture3.jpeg',
//     "musicGenre": "pop"
//   }

// ]

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
// app.get('/main', async (req, res) => {
//   try {
//     let user = await profiles
//     .findOne({ firstname: "Julius"});

//   currentUser = availableUser();
//   const userprofiles = await profiles.find({"musicGenre": "pop"}).toArray();
//   res.render('main', {
//     user: currentUser,
//     userprofiles
//   });
//   }
//    catch (error) {
//     console.log("Something went wrong")
//   }
// });
app.get('/main', async (req, res) => {
  // Fetch user data
  const cursor = await users2.find({musicGenre : "pop"}).toArray();
  useraccount.push(cursor);
  console.log(useraccount);
  currentUser = availableUser();

  const profiles = await users.find({musicGenre : "pop" }).toArray();
  console.log(profiles);
  res.render('main', {
  user: currentUser,
  profile: profiles[0]
})
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

//render login page
app.get('/', (req, res) => {
  res.render('login')
});
//click on likebutton > pushes currentuser to likedlist
app.post('/like', (req, res) => {
  likedList.push(currentUser);
  currentUser = availableUser();
  res.render('main', {
    user: currentUser
  });
});

//click on dislikebutton > pushes currentuser to dislikelist
app.post('/dislike', (req, res) => {
  dislikedList.push(currentUser);
  currentUser = availableUser();
  res.render('main', {
    user: currentUser
  });
});

//error message when typed in wrong path
app.use(function (req, res) {
  res.status(404).send("I'm sorry but we couldn't find that page!")
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
