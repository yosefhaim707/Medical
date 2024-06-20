

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors')
const port = 3000;


function doctorsApp() {

    // הגדרת סכמה למסמכי הרופאים
    const doctorSchema = new mongoose.Schema({
      id: String,
      category: String,
      name: String
      
    });

    // יצירת מודל הרופאים
    const Doctor = mongoose.model('Doctor', doctorSchema);




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

    app.get('/doctors/:name', (req, res) => {
      const doctorName = req.params.name;
      const doctor =  Doctor.findOne({name: doctorName});

      if (doctor) {
        res.json(doctor);
      } else {
        res.status(404).json({ error: `Doctor with name "${doctorName}" not found` });
      }
    });
}

module.exports = doctorsApp;