const fs = require('fs');
const mime = require('mime');
const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync('./site/database/db.json'));
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

db.defaults({users: [], movies: []}).write();
var active_users = [];

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
function getIP(req){
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

function getUserFromIP(ip){
    for(let i = 0; i < active_users.length; i++){
        if(active_users[i].ip === ip){
            return db.get('users').find({username: active_users[i].username}).value();
        }
    }
    return false;
}

app.post('/checkuser', function(req, res) {

    const user = {
        name: req.body.username,
        pass: req.body.password,
        action: req.body.action,
        ip: getIP(req)
    }

    if(user.action == 'Log In'){
        if(db.get('users').find({username: user.name, password: user.pass}).value()){

            //See if the user loggin in is currently connected to the server
            let newuser = true;
            for(var i = 0; i < active_users.length; i++){
                if(active_users[i].username === user.name){
                    active_users[i].ip = user.ip;
                    newuser = false;
                    break;
                }
            }
            if(newuser){
                active_users.push({
                    ip: user.ip,
                    username: user.name
                });
            }

            res.redirect('/friends');
        } else {
            res.end('Username or password incorrect'); //error
        }
    } else if(user.action == 'Sign Up'){
        if(db.get('users').find({username: user.name}).value()){
            res.end('Sorry! Someone already has that username'); //error
        } else {
            db.get('users').push({
                username: user.name,
                password: user.pass
            }).write();
            res.redirect('/editprofile');
        }
    }
})

app.post('/makeprofile', function(req, res) {
    db.get('users').push({
        name: req.body.name,
        genres: req.body.genres
    }).write();
    res.end("User " + req.body.name + " added to database!");
})

app.post('/userdata', function(req, res) {

    let user = db.get('users').find({username: req.body.username}).value();

    let userdata = {
        friends: user.friends,
        genres: user.genres,
        services: user.services
    }
    
    console.log("Returning userdata for " + user.username + ".");
    res.end(JSON.stringify(userdata));
})

app.post('/movies', function(req, res) {
    console.log("Returning movies");
    sendFile(res, './site/database/movies.json');
})

app.get('/addfriend', function (req, res) {
    let user = getUserFromIP(getIP(req));
    if(user){
        const friend = req.body.friend;
        if(db.get('users').find({username: friend}).friendrequests.push(user.username))
            console.log("Friend request sent!");
        else
            console.log("User not found to friend");
    } else {
        console.log("User logged out");
        res.redirect('/login');
    }
})

// Pages and file access
app.get('/', function (req, res) {
    console.log("User " + getIP(req) + " has connected!");
    sendFile(res, './site/index.html');
})

app.get('/main.css', function (req, res) {
    sendFile(res, './site/styles/main.css');
})

app.get('/bundle.js', function(req, res) {
    sendFile(res, './site/scripts/bundle/bundle.js');
})

app.get('/login', function (req, res) {
    sendFile(res, './site/pages/login.html');
})

app.get('/friends', function (req, res) {
    let user = getUserFromIP(getIP(req));
    if(user){
        console.log("Showing user " + user.username + " friends");
        sendFile(res, './site/pages/friends.html');
    } else {
        console.log("User logged out");
        res.redirect('/login');
    }
})

app.get('/swipe', function (req, res) {
    sendFile(res, './site/pages/swipe.html');
})

app.get('/editprofile', function (req, res) {
    sendFile(res, './site/pages/editprofile.html');
})

// Start server
app.listen(port, '192.168.0.131', () => {
    console.log(`Server listening at http://localhost:${port}`)
})