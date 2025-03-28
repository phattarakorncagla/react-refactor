"use strict";
const mail = document.getElementById('mail');
const password = document.getElementById('password');
const loginButton = document.getElementById('login_button');
if (mail && password && loginButton) {
    mail.onkeydown = function (event) {
        if (event.key === 'Enter') {
            loginButton.click();
        }
    };
    password.onkeydown = function (event) {
        if (event.key === 'Enter') {
            loginButton.click();
        }
    };
    loginButton.onclick = function () {
        if (mail.value === '' || password.value === '') {
            return alert('Please insert mail and password.');
        }
        // Logging user in
        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mail: mail.value,
                password: password.value
            })
        })
            .then(response => response.json())
            .then(json => {
            if (json.status !== 200) {
                return alert(json.message);
            }
            if (json.message === 'Failure') {
                mail.value = '';
                password.value = '';
                return alert('The mail or password is incorrect.');
            }
            else {
                window.location.href = '/dataMap';
            }
        })
            .catch((error) => {
            console.error(error);
            return alert('An error occurred, while trying to login.');
        });
    };
}
else {
    console.error('One or more elements are missing from the DOM.');
}
