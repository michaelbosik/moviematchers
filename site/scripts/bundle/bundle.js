(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let userdata;

window.onload = () => {
    getUser();
    fillFriends();
}

function getUser(){
    $.ajax({
        url: 'http://192.168.0.131.xip.io:3000/userdata',
        type: 'POST',
        xhrFields: {
            withCredentials: false
        }, 
        success: function(response) {
            userdata = JSON.parse(response);
            console.log(userdata.friends);
        }
    });
}

function fillFriends(){
    
}
},{}],2:[function(require,module,exports){
const url_prefix = 'http://192.168.0.131.xip.io:3000';
const min_movies = 5;
const max_movies = 25;

let movieList = [];
loadMovies();

function nextMovie(userID, friendID) {
    if (movieList.length < min_movies) {
        loadMovies();
    }
    movie = movieList.shift();
    console.log(movie);
    return movie;
}

function loadMovies(userID, friendID) {
    // $.ajax({
    //     url: url_prefix + '/userdata',
    //     type: 'POST',
    //     data: {
    //         username: userID
    //     },
    //     success: function(response) {
    //         user = response;
    //     }
    // });
    // $.ajax({
    //     url: url_prefix + '/userdata',
    //     type: 'POST',
    //     data: {
    //         username: friendID
    //     },
    //     success: function(response) {
    //         friend = response;
    //     }
    // });
    $.ajax({
        url: url_prefix + '/movies',
        type: 'POST',
        data: {
            genres: ['Drama'],
            services: ['Netflix']
        },
        success: function(response) {
            movies = response;
            console.log(movies);
            for (let i = 0; i < max_movies; i++) {
                movieList.push(movies[i]);
            }
        }
    });
}

},{}]},{},[1,2]);
