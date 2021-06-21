const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const {
  MongoClient,
  ObjectId
} = require('mongodb');

//Variables for like feature
let currentUserId = '60c634413a5553c132f69594'

let db = null;
// is collection van db.collection('profile)
let users = null;
// function connectDB
async function connectDB() {
  // get URI from .env file
  const uri = process.env.DB_URI
  // make connection to database
  const options = {
    useUnifiedTopology: true
  };
  const client = new MongoClient(uri, options)
  await client.connect();
  db = await client.db(process.env.DB_NAME)
  users = db.collection('profiles')

}

connectDB()
  .then(() => {
    // if succesfull connection is made, show a message
    console.log('Connection to MongoDB succesfull')
  })
  .catch(error => {
    // if connnection is unsuccesful, show errors
    console.log(error)
  });

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
app.set('view engine', 'ejs');

let shownUser = [];
let nLnDUsers = [];

app.get('/main', async (req, res) => {
  // Fetch current user data
  const queryCurrentUser = {
    _id: ObjectId(currentUserId)
  }
  let loggedUser = await users.findOne(queryCurrentUser);

  // Find user with unequal ID to currentUserId
  users.find({
    _id: {
      $ne: ObjectId(currentUserId)
    }
  }).toArray((error, neUsers) => {
      if (error) throw error;
      // Look for users in liked and disliked array from currentUser
      for (let i = 0; i < neUsers.length; i++) {

        // Push not liked or disliked users into nLnDUsers array
        if (
          !loggedUser.liked.includes(neUsers[i]._id) &&
          !loggedUser.disliked.includes(neUsers[i]._id)) {
          nLnDUsers.push(neUsers[i]);
          console.log(nLnDUsers[i]._id)
        }
      }
    },

    // Show first user in notLikednotDislikedUsers array
    shownUser = nLnDUsers[Math.floor(Math.random() * nLnDUsers.length)]);
  // Fetch user data
  res.render('main', {
    nLnDUsers,
    shownUser
  });
});
// renders page if liked
app.post('/like', async (req, res) => {
  await users.updateOne({
    _id: ObjectId(currentUserId)
  }, {
    $push: {
      liked: shownUser._id
    }
  })
  res.render('main', {
    nLnDUsers,
    shownUser
  })
});

// renders page if disliked
app.post('/dislike', async (req, res) => {
  await users.updateOne({
    _id: ObjectId(currentUserId)
  }, {
    $push: {
      disliked: shownUser._id
    }
  })
  res.render('main', {
    nLnDUsers,
    shownUser
  })
});

// renders like list
app.get('/likelist', async (req, res) => {
  try {
    let test = await getLikedList();
    res.render('likelist', {
      likedUse: test
    });
  } catch (error) {
    console.log(error)
  }

});

async function getLikedList() {
  try {
    let loggedIn = await users.findOne({
      _id: ObjectId(currentUserId)
    })

    let likedUsers = await users.find({
      _id: {
        $in: loggedIn.liked
      }
    }).toArray();

    return likedUsers;
  } catch (error) {
    console.log(error);
  }
}

// renders profile page 
app.get('/profile', (req, res) => {
  res.render('profilepage')
});

//render login page
app.get('/', (req, res) => {
  res.render('login')
});
//error message when typed in wrong path
app.use(function (req, res) {
  res.status(404).send("I'm sorry but we couldn't find that page!")
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});