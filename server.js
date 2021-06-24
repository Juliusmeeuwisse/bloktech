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

app.get('/main', async (req, res) => {
      let nLnDUsers = [];
      let loggedIn = await users.findOne({
        id: currentUserId
      })
      const currentUserGenre = loggedIn.musicGenre
      // find users with genre equal to current user genre and put them in an array
      users.find({
        musicGenre: {
          $eq: (currentUserGenre)
        }
      }).toArray((error, availableUsersList) => {
        // check if users from availableuserslist have the same ID if they do splice them from array
          for (let i = 0; i < availableUsersList.length; i++) {
            if (availableUsersList[i].id === currentUserId) {
              availableUsersList.splice(i, 1);
            }
          }
          // for each user in available userlist check if its not in loggedIn user's liked/disliked if it isnt push it to nlnDUsers
            for (let i = 0; i < availableUsersList.length; i++) {
              if (
                !loggedIn.liked.includes(availableUsersList[i].id) &&
                !loggedIn.disliked.includes(availableUsersList[i].id)) {
                nLnDUsers.push(availableUsersList[i]);
              }
            }
          // grab a random user from nLnDUsers array and put it in ShownUser variable
        shownUser = nLnDUsers[Math.floor(Math.random() * nLnDUsers.length)];
        res.render('main', {
          nLnDUsers,
          shownUser
        });
      });
    })

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
      res.redirect('main')
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
      res.redirect('main')
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
// function to get liked list
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