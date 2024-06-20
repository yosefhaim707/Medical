
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors')
const port = 3000;

// קישור לבסיס הנתונים MongoDB
mongoose.connect('mongodb://localhost/MentalHealth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

    
// הגדרת סכמה לפגישות

const meetingSchema = new mongoose.Schema({

  date : String,
  time: String,
  doctor: String,
  address: String,
  user_id: String
});


// יצירת מודל הפגישות
const Meeting = mongoose.model('Meeting', meetingSchema);




// הגדרת סכמה למסמכי המשתמשים
const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    password: String
});

// יצירת מודל המשתמשים
const User = mongoose.model('User', userSchema);

// הגדרת מידלוור לפרסור של נתוני JSON
app.use(express.json());
app.use(cors());


async function getUsers() {
const users = await User.find({});
console.log('All users:', users);
}

getUsers();
// doctorsApp()

// נתיב להתחברות של משתמש
app.post('/api/check-username', async (req, res) => {
  console.log(req.body)
  const  password  = req.body.password;
  const username = req.body.username.toLowerCase();
  console.log(username);
  console.log(password);

  try {
    // חיפוש משתמש וסיסמא בבסיס הנתונים
    const user = await User.findOne({ userName: username.toLowerCase() });
    console.log(user);
    if (!user) {
      console.log(`user ${username} not found`);
      // המשתמש לא קיים בבסיס הנתונים, אי אפשר להתחבר
      res.status(401).send(JSON.stringify({exists: false , correctPassword: false}));
    }
     // הסיסמא אינה נכונה, אי אפשר להתחבר
    else if(user.password !== password) {
      console.log(user.password);

      res.status(401).send(JSON.stringify({exists: true, correctPassword: false}));
    }

    // הסיסמא נכונה, הלקוח מקבל אישור על כך ואת כל פרטי הלקוח ופגישותיו
    else{
      const user_id = user._id.toString();
      const userMettings = await Meeting.find({user_id: user_id});
      console.log(userMettings);
      res.status(200).send(JSON.stringify({exists: true, correctPassword: true, useerObj: user , mettings: userMettings}));
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('שגיאה בשרת');
  }
});




    // הגדרת סכמה למסמכי הרופאים
    const doctorSchema = new mongoose.Schema({

      name : String,
      specialization : String,
      location : String,
      image : String,
      
    });

    // יצירת מודל הרופאים
    const Doctor = mongoose.model('Doctor', doctorSchema);

    // הגדרת מידלוור לפרסור של נתוני JSON
    app.use(express.json());
    app.use(cors());


    async function getDoctors() {
      const doctors = await Doctor.find({});
      console.log('All doctors:', doctors);
      }


    getDoctors();



    // שליחת כל הרופאים
    app.get('/api/get-doctors', async (req, res) => {
        console.log("ממתין לבקשת גט לכל הרופאים");
      console.log(req.body)
    try {
      const doctors = await Doctor.find({});
      res.status(200).json(doctors);
    } catch (error) {
      console.error(error);
      res.status(500).send('שגיאה בשרת');
    }
    });

    app.get('/doctors/:name', async (req, res) => {
      const doctorName = req.params.name;
      try {
      const doctor = await Doctor.find({name: doctorName});

      if (doctor) {
        res.status(200).json(doctor);
      } else {
        res.status(404).json({ error: `Doctor with name "${doctorName}" not found` });
      }
    }
    catch (error) {
      console.error(error);
      res.status(500).send('שגיאה בשרת');
    }
    });





// שליחת פגישה לפי I D
app.get('/meetings/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const meeting = await Meeting.find({user_id: id});
  if (meeting) {
    res.status(200).json(meeting);
  } else {
    res.status(404).json({ error: `Meeting with id "${id}" not found` });
  }
  } catch (error) {
    console.error(error);
    res.status(500).send('שגיאה בשרת');
  }
});


// רישום פגישה חדשה במסד הנתונים
app.post('/add-meeting', async (req, res) => {
  console.log(req);
  const meeting = req.body;
  
  try {
    const newMeeting = new Meeting(meeting);
    console.log("new meeting", newMeeting);

    // וולידצייה של האובייקט
    const validationErrors = newMeeting.validateSync();
    if (validationErrors) {
      return res.status(400).json({ errors: validationErrors.errors });
    }
    await newMeeting.save();
    console.log('New meeting added:', newMeeting);
    res.status(201).json(newMeeting);
  } catch (error) {
    console.error(error);
    res.status(500).send('שגיאה בשרת');
  }
});


// עדכון 



// הפעלת השרת
app.listen(port, () => {
  console.log(`server listening happy at port ${port}`);
});