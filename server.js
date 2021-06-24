const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const {
  MongoClient
} = require('mongodb');

//Variables for like feature
let currentUserId = '5'

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
  EqualGenres().then(data => {
    console.log(data);
  });

  // Fetch current user data
  let shownUser = await users.findOne({
    id: currentUserId
  })
  res.render('main', {
    nLnDUsers,
    shownUser
  })
});


// Fetch user data


// renders page if liked
app.post('/like', async (req, res) => {
  await users.updateOne({
    id: currentUserId
  }, {
    $push: {
      liked: shownUser.id
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
    id: currentUserId
  }, {
    $push: {
      disliked: shownUser.id
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
      id: currentUserId
    })

    let likedUsers = await users.find({
      id: {
        $in: loggedIn.liked
      }
    }).toArray();

    return likedUsers;
  } catch (error) {
    console.log(error);
  }
}

const EqualGenres = async () => {
  let loggedIn = await users.findOne({
    id: currentUserId
  })
  const currentUserGenre = loggedIn.musicGenre
  users.find({
    musicGenre: {
      $eq: (currentUserGenre)
    }
  }).toArray((error, userGenre) => {

    function deleteUser() {
      for (let i = 0; i < userGenre.length; i++) {
        if (userGenre[i].id === currentUserId) {
          userGenre.splice(i, 1)
          return;
        }
      }
    }
    deleteUser();

    function likedAndDisliked() {
      for (let i = 0; i < userGenre.length; i++) {
        if (
          loggedIn.liked.includes(userGenre[i].id) ||
          loggedIn.disliked.includes(userGenre[i].id)) {
          userGenre.splice(i, 1)
          return;
        }
      }
    }
    likedAndDisliked();
    if (error) throw error;
    return userGenre;
  })
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