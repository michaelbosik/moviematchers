const fs = require('fs');
const mime = require('mime');
const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync('db.json'));
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

db.defaults({users: [], movies: []}).write();

// Read requested file to respond with
const sendFile = function (res, filename) {
    const type = mime.getType(filename);
    fs.readFile(filename, function (err, content) {
        if (err === null) {
            res.writeHeader(200, {
                'Content-Type': type
            });
            res.end(content);
        } else {
            res.writeHeader(404);
            res.end('404 Error: File Not Found');
        }
    });
};

// Sign in
app.post('/checkuser', function(req, res) {
    //ADD CHECK FOR EXISTING USER IN DB WITH CORRECT PASSWORD
    const name = req.body.username;
    const pass = req.body.password;
    const action = req.body.action;

    if(action == 'Log In'){
        if(db.get('users').find({username: name, password: pass}).value()){
            res.end('Found user!');
        } else {
            res.end('Username or password incorrect');
        }
    } else if(action == 'Sign Up'){
        if(db.get('users').find({username: name}).value()){
            res.end('Sorry! Someone already has that username');
        } else {
            db.get('users').push({
                username: name,
                password: pass
            }).write();
            res.end('Successfully signed up!');
        }
    }

    //IF GOOD 
    // sendFile(res, './site/pages/friends.html');
    //ELSE THROW ERROR
})

// Database endpoints
app.post('/makeprofile', function(req, res) {
    db.get('users').push({
        name: req.body.name,
        genres: req.body.genres
    }).write();
    res.end("User " + req.body.name + " added to database!");
});

app.get('/getuser', function(req, res) {
    res.end(db.get('users').find({id: req.body.id}));
});

app.post('/deleteuser', function(req, res) {
    db.get('users').remove({id: req.body.id}).write();
    res.end('Deleted item');
});

// Page GET handlers
app.get('/', function (req, res) {
    console.log("User has connected!");
    sendFile(res, './site/index.html');
});

app.get('/main.css', function (req, res) {
    sendFile(res, './site/styles/main.css');
});

app.get('/login', function (req, res) {
    sendFile(res, './site/pages/login.html');
});

app.get('/friends', function (req, res) {
    console.log("friends")
    sendFile(res, './site/pages/friends.html');
});

app.get('/logout', function (req, res) {
    loggedIn = '';
    req.session.destroy();
    res.redirect('/');
});


// Start server
app.listen(port, '192.168.0.131', () => {
    console.log(`Server listening at http://localhost:${port}`)
})