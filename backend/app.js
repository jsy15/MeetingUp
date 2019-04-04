/**
 * To get started install
 * express bodyparser jsonwebtoken express-jwt
 * via npm
 * command :-
 * npm install express bodyparser jsonwebtoken express-jwt --save
 */

// Bringing all the dependencies in
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const cors = require('cors');
const mysql = require('mysql');
  const md5 = require('md5');

// Instantiating the express app
const app = express();


const SELECT_ALL_EVENTS_QUERY ='SELECT * FROM events';
const SELECT_ALL_USERS_QUERY = 'SELECT fname, lname, username FROM users';


app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'jsy15',
    password: '55115',
    database: 'MeetUp'
});

connection.connect(err => {
    if(err) {
        return err;
    }
});

// See the react auth blog in which cors is required for access
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

// Setting up bodyParser to use json and set it to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// INstantiating the express-jwt middleware
const jwtMW = exjwt({
    secret: 'keyboard cat 4 ever'
});



// LOGIN ROUTE
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    var dataUsername;
    var dataId;
    var validated;
    var today = new Date();
    
    // Use your DB ORM logic here to find user and compare password
    connection.query(`SELECT username, password, user_id FROM users WHERE username = '${username}'`, (err, results, rows) => {
      if(err) {
        return res.send(err)
      }
      else {
        if(results.length >= 1){
          if(results[0].password == md5(password)){
            validated = true;
            dataUsername = results[0].username;
            dataId = results[0].user_id;

              // Finds first username and password match in users array (assumes usernames are unique)
              //var user = users.find(u => username == u.username && password == u.password);
              if (validated) { // User credentials matched (are valid)
                let token = jwt.sign({ id: dataId, username: dataUsername }, 'keyboard cat 4 ever', { expiresIn: 5000 }); // Sigining the token
                console.log(dataUsername + " has logged on at: " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
                res.json({
                    sucess: true,
                    err: null,
                    token
                });
            } else { // User credentials did not match (are not valid) or no user with this username/password exists
                res.status(401).json({
                    sucess: false,
                    token: null,
                    err: 'Username or password is incorrect'
                });
            }
          }
        }
        else {
          console.log("No results")
        }
      }
    });
    
    
    
    
});

app.get('/testroute', jwtMW, (req, res) => {
    const basemessage = 'go to /events to see events \ngo to /users to see users';
    res.send({test1: `${basemessage}`});
  });

app.get('/events', jwtMW, (req, res) => {
    const SELECT_ALL_EVENTS_QUERY = 'SELECT * FROM events';
    connection.query(SELECT_ALL_EVENTS_QUERY, (err, results) => {
        if(err) {
            return res.send(err)
        }
        else{
            return res.json({
                data:results
            })
        }
    });
});

app.get('/events/add', jwtMW, (req, res) => {
    const { name, description, private, creator_id } = req.query;
    const INSERT_EVENTS_QUERY = `INSERT INTO events(name, description, isprivate, creator_id) VALUES('${name}', '${description}', ${private}, ${creator_id})`;
    connection.query(INSERT_EVENTS_QUERY, (err, results) => {
      if(err) {
        return res.send(err)
      }
      else{
        return res.send('successful')
      }
    });
  });
  
  app.get('/user/verify', jwtMW, (req, res) => {
    const hashedpassword = md5(req.query.password);
    const username = req.query.username;
    const VERIFY_USER_QUERY = `SELECT password from users where username = '${username}'`;
    connection.query(VERIFY_USER_QUERY, (err, results) =>{
      if(err) {
        return res.send(err)
      }
      else if(results.length > 0){
        if(results[0].password == `${hashedpassword}`){
          res.send('verified')
        }
        else{
          res.send('unverified')
        }
      }
      else{
        res.send('unverified')
      }
    });
  });

  app.get('/users', jwtMW, (req, res) => {
    connection.query(SELECT_ALL_USERS_QUERY, (err, results) => {
      if(err) {
        return res.send(err)
      }
      else{
        return res.json({
          data: results
        })
      }
    });
  });

  app.get('/userscheck', (req, res) => {
    const { password, fname, lname, username } = req.query;
    const USER_CHECK = `INSERT INTO users (password, fname, lname, username) VALUES ('${password}', '${fname}', '${lname}', '${username}')`;
    connection.query(USER_CHECK, (err, results) => {
      if(err) {
        return res.send("User already exists");
      }
      else{
        return res.send(`Added user: ${username}`);
      }
    });
  });
  
  app.get('/users/add', (req, res) => {
    const { password, lname, uname, username } = req.query;
    const INSERT_USERS_QUERY = `INSERT INTO users(password, lname, uname, username) VALUES('password', 'lname', 'uname', 'username')`;
    connection.query(INSERT_USERS_QUERY, (err, results) => {
      if(err) {
        return res.send(err)
      }
      else{
        return res.json({
          data: results
        })
      }
    });
  });

  app.get('/event/id', jwtMW, (req, res) => {
    console.log(req.query);
    if(req.query.event_id){
      const { event_id } = req.query;
      const GET_EVENT_QUERY = `SELECT * FROM events WHERE event_id = ${event_id}`;
      console.log(GET_EVENT_QUERY);
      connection.query(GET_EVENT_QUERY, (err, results) => {
        if (err) {
          res.send("Unable to find event");
        }
        else {
          return res.json({
            data:results
          })
        }
      });
    }
    else if(req.query.creator_id){
      const { creator_id } = req.query;
      const GET_CREATOR_QUERY = `SELECT username FROM users WHERE user_id = ${creator_id}`;
      console.log(GET_CREATOR_QUERY);
      connection.query(GET_CREATOR_QUERY, (err, results) => {
        if (err) {
          res.send("Unable to find creator");
        }
        else {
          return res.json({
            data:results
          })
        }
      });
    }
    
  });

  app.get('/event/attending', jwtMW, (req, res) => {
    const { event_id } = req.query;
    const GET_ATTENDING_QUERY = `SELECT username, users.user_id as user_id FROM attending INNER JOIN users ON users.user_id = attending.user_id WHERE attending.event_id = ${event_id}`;
    console.log(GET_ATTENDING_QUERY);
    connection.query(GET_ATTENDING_QUERY, (err, results) => {
      if(err){
        res.send("Unable to results");
      }
      else {
        return res.json({
          data:results
        })
      }
    });
  });

  app.get('/event/checkattending', jwtMW, (req, res) => {
    const { event_id } = req.query;
    const GET_ATTENDING_LIST = `SELECT creator_id FROM events WHERE event_id = ${event_id}`;
    console.log(GET_ATTENDING_LIST);
    connection.query(GET_ATTENDING_LIST, (err, results) => {
      if(err){
        res.send("Query has failed");
      }
      else {
        res.json({
          data:results
        })
      }
    });
  });

  app.get('/invite', jwtMW, (req, res) => {
    const { username, sender, event_id } = req.query;
    const GET_USERID_FROM_USERNAME_QUERY = `SELECT user_id FROM users WHERE username = '${username}'`;
    console.log(GET_USERID_FROM_USERNAME_QUERY);
    connection.query(GET_USERID_FROM_USERNAME_QUERY, (err, results)=>{
      if(err){
        return res.send(err);
      }
      else if(results.length > 0){
        var returnnum = results[0].user_id;
        console.log("The lookup for ", username, " returned the id: " , returnnum);
        const INVITE_USER_QUERY = `INSERT INTO invitelist (\`invited_user_id\`, \`event_id\`, \`sender_user_id\`) VALUES (${returnnum}, ${event_id}, ${sender})`;
        console.log(INVITE_USER_QUERY);
        connection.query(INVITE_USER_QUERY, (err, results)=>{
          if(err){
            return res.send(err);
          }
          else {
            return res.send("Successfully invited the user");
          }
        });
      }
      else{
        return res.send("No results for that username");
      }
    });
  })

app.get('/', jwtMW /* Using the express jwt MW here */, (req, res) => {
    res.send('You are authenticated'); //Sending some response when authenticated
});

// Error handling 
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
        res.status(401).send(err);
    }
    else {
        next(err);
    }
});

// Starting the app on PORT 8080
const PORT = 8080;
app.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`Magic happens on port ${PORT}`);
});
