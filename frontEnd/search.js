let doctors = []


async function getDoctors() {
    try {
        const response = await fetch('http://localhost:3000/api/get-doctors');
        const data = await response.json();
        doctors = data;
        if (doctors.length > 0) {
            main()
        }
        else {
            console.log("no doctors")
        }
    } catch (error) {
        console.error(error);
    }
}

getDoctors();

function main() {

    const doctorList = document.getElementById("doctors-list");
    doctorList.classList.add("doctor-list");

    function displaydoctors(array) {
        doctorList.innerHTML = "";
        array.map((doctor) => {
            const doctorCard = document.createElement("div");
            doctorCard.classList.add("doctor-card");
            doctorCard.innerHTML = `
        <h4>Name: ${doctor.name}</h4>
        <p>Specialization: ${doctor.specialization}</p>
        <p>Location: ${doctor.location}</p>
        <button id="${doctor.id}"  class="appointment-button">Make an appointment</button>
        
           
        `;
            doctorList.appendChild(doctorCard);

            const makeAppointement = doctorCard.querySelector(".appointment-button");

            makeAppointement.addEventListener("click", () => {
                openAppointmentPopup(doctor);

            });


        });
    }


    displaydoctors(doctors)



    function filterDoctorByName(SearchName) {
        return doctors.filter((doctor) => {
            return doctor.name.toLowerCase().includes(SearchName.toLowerCase());
        });

    }

    function filterDoctorByCategory() {
        const checkboxes = document.querySelectorAll('#category-container input[type="checkbox"]:checked');
        const selectedCategories = Array.from(checkboxes).map((checkbox) => checkbox.value);

        if (selectedCategories.length === 0) return doctors;

        return doctors.filter(doctor => selectedCategories.includes(doctor.specialization));
    }




    function updateDoctorList(filteredDoctor) {
        displaydoctors(filteredDoctor);
    }


    const searchBtn = document.getElementById("submit-search");



    searchBtn.addEventListener("click", () => {
        const searchName = document.getElementById("srchByName").value.trim();
        let filteredDoctor = filterDoctorByCategory();
        if (searchName !== '') {
            filteredDoctor = filteredDoctor.filter(doctor => doctor.name.toLowerCase().includes(searchName.toLowerCase()));
        }

        updateDoctorList(filteredDoctor);
    });




    function openAppointmentPopup(doctor) {
        const popup = document.getElementById("appointmentPopup");
        popup.style.display = "block";
        //popup.style.alignItems = "center";
        //popup.style.display = "none";
        popup.style.position = "fixed";
        popup.style.left = "0";
        popup.style.top = "0";
        popup.style.width = "100%";
        popup.style.height = "100%";
        popup.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        popup.style.display = "flex";
        popup.style.justifyContent = "center";
        popup.style.alignItems = "center";
        popup.style.zIndex = "1000";


        const form = document.getElementById("appointmentForm");
        const dateInput = document.getElementById("appointmentDate");
        const timeSelect = document.getElementById("appointmentTime");

        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;

        // Clear previous options if any
        timeSelect.innerHTML = '';

        // Generate time options every half hour from 9:00 AM to 5:00 PM
        const startTime = 9; // 9:00 AM
        const endTime = 17; // 5:00 PM
        for (let hour = startTime; hour <= endTime; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const option = document.createElement('option');
                option.value = timeString;
                option.textContent = timeString;
                timeSelect.appendChild(option);
            }
        }
        form.onsubmit = (event) => {
            event.preventDefault();
            const date = dateInput.value;
            const time = timeSelect.value;
            showAlert(`Appointment made with ${doctor.name} on ${date} at ${time}`);
            popup.style.display = "none";
            user_id =JSON.parse( localStorage.getItem('userObj'))._id;
            console.log(user_id);
            // יצירת אובייקט עם הפרטים הנדרשים
            const appointment = {
   
                "date": date,
                "time": time,
                "doctor": doctor.name,
                "address": doctor.location,
                // כאן כאן כאן צריך לשים את ה תעודת זהות האמיתיתתתתתתתתתתת
                "user_id":user_id
            };

            // הדפסת האובייקט שנוצר
            console.log(appointment);
            sendMeetingRequest(appointment);
        };

    };


    function showErrorPopup(message) {
        const popup = document.getElementById("errorPopup");
        const errorText = document.getElementById("errorText");
        errorText.textContent = message;
        popup.style.display = "block";
    }


    const closeButton = document.getElementById("closeAlert");
    closeButton.onclick = function () {
        const popup = document.getElementById("customAlert");
        popup.style.display = "none";
    };

    // const closeErrorButton = document.querySelector(".close-error");
    // closeErrorButton.onclick = function () {
    //     const popup = document.getElementById("errorPopup");
    //     popup.style.display = "none";
    // };

    window.onclick = function (event) {
        const appointmentPopup = document.getElementById("appointmentPopup");
        const errorPopup = document.getElementById("errorPopup");
        if (event.target == appointmentPopup) {
            appointmentPopup.style.display = "none";
        } else if (event.target == errorPopup) {
            errorPopup.style.display = "none";
        }
    };




    function showAlert(message) {
        const alertPopup = document.getElementById("customAlert");
        const alertMessage = document.getElementById("alertMessage");
        alertMessage.textContent = message;
        alertPopup.style.display = "flex";
    }

    function closeAlert() {
        const alertPopup = document.getElementById("customAlert");
        alertPopup.style.display = "none";
    }





    // דוגמה לשימוש ב-showAlert
    document.getElementById("submit-search").addEventListener("click", function () {
        showErrorPopup("This Dr. is not available.");
    });

    function logout() {
        localStorage.clear();  // מחיקת כל הפרטים המאוחסנים ב-LocalStorage
        sessionStorage.clear();  // מחיקת כל הפרטים המאוחסנים ב-SessionStorage
        alert("You have been logged out successfully.");
    }

    // הוספת מאזין אירועים לכפתור היציאה
    document.getElementById("logout").addEventListener("click", logout);


// שליחת פגישה שנקבעה לשרת
   async function sendMeetingRequest(obj) {

    try {
        const response = await fetch('http://localhost:3000/add-meeting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}





} 



const logoutButton = document.getElementById('logout-link')

logoutButton.addEventListener('click', function () {
    const confirmation = confirm("האם אתה בטוח שברצונך להתנתק?");
    if (confirmation) {
        localStorage.setItem('signedIn', "false");
        window.location.href = 'index.html';}
})

