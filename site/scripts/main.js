require('jquery')

function nextMovie(userID, friendID) {
    $.ajax({
        url: '/userdata',
        type: 'get',
        data: {
            UserID: userID
        },
        success: function(response) {
            console.log(response)
        }
    });
}
