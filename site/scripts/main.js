
function nextMovie(userID, friendID) {
    
    var data = {
        username: userID
    };

    $.ajax({
        url: 'http://192.168.0.131.xip.io:3000/userdata',
        type: 'POST',
        data: data,
        xhrFields: {
            withCredentials: false
        }, 
        success: function(response) {
            console.log(response)
        }
    });
}