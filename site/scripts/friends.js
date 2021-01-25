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