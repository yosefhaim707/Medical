let userImport = JSON.parse(localStorage.getItem('userObj'));
let userMeetings = JSON.parse(localStorage.getItem('userMeetings'));

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
        window.location.href = 'index.html';}
}

const appointment = document.querySelector('.appointments-list');
meetings = JSON.parse(localStorage.getItem('userMeetings'));
console.log(meetings);
meetings.map((meeting) => {
    let singleMeeting = document.createElement('div')
    singleMeeting.className = 'single-appointment-container'
    singleMeeting.innerHTML =   `            

    <div class="appointment-info">
        <p class="doctor-name">${meeting.doctor}</p>
        <p class="date">${meeting.date}</p>
        <p class="time">${meeting.time}</p>
        <p class="address">${meeting.address}</p>

    </div>`
    appointment.appendChild(singleMeeting)

})