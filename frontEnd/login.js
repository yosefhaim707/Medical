let usernameInput = document.getElementById('username');
let passwordInput = document.getElementById('password');
let submitButton = document.getElementById('submitbtn');
let errorMessage = document.getElementById('error-message');
let userObj;
let userMeetings;

async function login(username, password) {
    try {
        // Check if username exists
        const response = await fetch('http://localhost:3000/api/check-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        });
        
        const result = await response.json();
        console.log(result);
        if (!result.exists) {
            console.log('Login failed');
            errorMessage.textContent = 'Username does not exist';
            resetInputs()
            // throw new Error('Username does not exist');
            
        }

        else if (!result.correctPassword) {
            console.log('Login failed');
            errorMessage.textContent = 'Incorrect password';
            passwordInput.value = '';
            // throw new Error('Incorrect password');
        }
        else {
            console.log(result);
            userObj = result.useerObj;
            userMeetings = result.mettings;
            localStorage.setItem('userObj', JSON.stringify(userObj));
            localStorage.setItem('userMeetings', JSON.stringify(userMeetings));
            console.log(localStorage);
            // sessionStorage.setItem('userObj', JSON.stringify(userObj));
            // sessionStorage.setItem('userMeetings', JSON.stringify(userMeetings));
            localStorage.setItem('signedIn', "true");

            window.location.href = 'index.html';
        }
    }
    catch (error) {
        errorMessage.textContent = 'An Error Occurred';
        resetInputs()
        console.error(error);
        
    }
}

function resetInputs() {
    usernameInput.value = '';
    passwordInput.value = '';
}
submitButton.addEventListener('click', () => {
    errorMessage.textContent = '';
    login(usernameInput.value, passwordInput.value);
});








// let signedIn
// function CheckLogin() {
//     if (localStorage.getItem('signedIn') === null) {
//         signedIn = "false";
//         localStorage.setItem('signedIn', signedIn);
//     }
// }

// CheckLogin();

// const loginButton = document.getElementById('login-button')
// const findButton = document.getElementById('find-button')
// const profileButton = document.getElementById('profile-button')

// function isLoggedIn() {
//     console.log(localStorage.getItem('signedIn'));
//     return localStorage.getItem('signedIn') === "true";
// }



// function changeButtons() {
//     signedIn = isLoggedIn();
//     if (signedIn) {
//         document.getElementById('logout-link').style.display = 'flex';
//         document.getElementById('login-link').style.display = 'none';
//     }
//     else {
//         document.getElementById('logout-link').style.display = 'none';
//         document.getElementById('login-link').style.display = 'flex';
//     }
// }

// changeButtons();

// window.addEventListener('storage', () => {
//     if (localStorage.getItem('signedIn') === 'true') {
//       signedIn = "true";
//       changeButtons();
//     }
//   });