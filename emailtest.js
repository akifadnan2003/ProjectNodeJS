const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();
const dbQueries = require('./dbServices');
const fs = require('fs');

const pool = new Pool({
    host: "localhost",
    user: process.env.DBUSER,
    port: 5432,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});


// Configure mail transport
const transporter = nodemailer.createTransport({
  service: 'Hotmail',
  auth: {
    user: 'nodejsproje@hotmail.com', // Your Yahoo email address
    pass: 'AkifKalpMustafaOp123!' // Your Yahoo password
  }
});

// Define your email message
const mailOptions = {
  from: 'nodejsproje@hotmail.com',
  to: 'nodejsproje@hotmail.com',
  subject: 'Weekly Update',
  text: 'this will be from database'
};

/*
// Send the email no schedule
transporter.sendMail(mailOptions, (error, info) => {

    
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }


    client.release();
  });
  */


  
// Schedule the email to be sent every Saturday at 8:47 PM
cron.schedule(process.env.DBMAILINGTIME, async () => {


  try {
    // Get a client from the pool
    const client = await pool.connect();

    // Query the database to get the email text
    const result = await client.query('SELECT * FROM ogrenci_sayacideneme1.ogrenci_sayacdeneme');
    const emailText = result.rows[0].sayac; // Adjust the column name as per your database schema

    const resultJSON = await client.query('SELECT * FROM Öğrenci."Öğrenci";');
    // Convert the result to a JSON string
    const jsonString = JSON.stringify(resultJSON.rows);


    
    fs.writeFile('students.json', jsonString, (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
    
      console.log('File saved successfully');
    
      // Update the mailOptions object with the fetched email text and attach the file
      const mailOptions = {
        from: 'nodejsproje@hotmail.com',
        to: 'nodejsproje@hotmail.com',
        subject: 'Weekly Update',
        text: "number is: " + emailText,
        attachments: [
          {
            filename: 'students.json',
            content: jsonString
          }
        ]
      };
    
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
    
        // Release the client back to the pool
        client.release();
      });
    });
    
    //attach this file to the mail here.


    // Update the mailOptions object with the fetched email text
    /*
    const mailOptions = {
      from: 'mustafaerkin@hotmail.com',
      to: 'mustafaerkin@hotmail.com',
      subject: 'Weekly Update',
      text: "number is: "+emailText
    };
    */

    // Send the email
    /*
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }

      // Release the client back to the pool
      client.release();
    });
    */
  } catch (err) {
    console.error('Error fetching email text from database:', err);
  }
}, {
  scheduled: true,
  timezone: "Europe/Istanbul" // Set your timezone
});


