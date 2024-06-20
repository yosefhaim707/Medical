
let signedIn
function CheckLogin() {
    if (localStorage.getItem('signedIn') === null) {
        signedIn = "false";
        localStorage.setItem('signedIn', signedIn);
    }
}

CheckLogin();

const loginButton = document.getElementById('login-link')
const logoutButton = document.getElementById('logout-link')
const findButton = document.getElementById('find-link')
const profileButton = document.getElementById('profile-link')

function isLoggedIn() {
    console.log(localStorage.getItem('signedIn'));
    return localStorage.getItem('signedIn') === "true";
}



function changeButtons() {
    signedIn = isLoggedIn();
    if (signedIn) {
        document.getElementById('logout-link').style.display = 'flex';
        document.getElementById('login-link').style.display = 'none';
        
    }
    else {
        document.getElementById('logout-link').style.display = 'none';
        document.getElementById('login-link').style.display = 'flex';
        profileButton.href = ''
        profileButton.onclick = function () {
        window.alert('התחבר תחילה לחשבונך')}

        findButton.href =  ''
        findButton.onclick = function () {
            window.alert('התחבר תחילה לחשבונך')
            }
        }
    }

    changeButtons();

    window.addEventListener('storage', () => {
        if (localStorage.getItem('signedIn') === 'true') {
            signedIn = "true";
            changeButtons();
        }
    });


    logoutButton.onclick = function () {
        const confirmation = confirm("האם אתה בטוח שברצונך להתנתק?");
        if (confirmation) {
            localStorage.setItem('signedIn', "false");
            window.location.href = 'index.html';
        }
    }