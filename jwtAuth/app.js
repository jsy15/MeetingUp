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
            console.log("Database information");
            console.log(dataUsername);
            console.log(dataId);
            console.log(validated);

              // Finds first username and password match in users array (assumes usernames are unique)
              //var user = users.find(u => username == u.username && password == u.password);
              if (validated) { // User credentials matched (are valid)
                let token = jwt.sign({ id: dataId, username: dataUsername }, 'keyboard cat 4 ever', { expiresIn: 5000 }); // Sigining the token
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
    const { name, description, creator_id } = req.query;
    const INSERT_EVENTS_QUERY = `INSERT INTO events(name, description, creator_id) VALUES('${name}', '${description}', ${creator_id})`;
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
  
  app.get('/users/add', jwtMW, (req, res) => {
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

// Starting the app on PORT 3000
const PORT = 8080;
app.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`Magic happens on port ${PORT}`);
});
