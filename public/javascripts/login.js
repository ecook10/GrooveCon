$(document).ready(function() {
    $('#submit_login').click(login);
    $('#new_account').click(newUser);
});

function login() {
    var username = $('#user_in').val();
    var password = $('#pw_in').val();
    $('#pw_in').val("");

    $.post('./process_login', {user: username, pass: password}, function(data) {
        window.location = data
    });
}

function newUser(event) {
    event.preventDefault();
    console.log("new user");
}
