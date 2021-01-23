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
