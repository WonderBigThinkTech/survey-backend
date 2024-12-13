require("dotenv").config();
const port = process.env.PORT || 7777;
var cors = require("cors");
const nodemailer = require('nodemailer');
var express = require("express");
var app = express();
const bodyParser = require("body-parser");

const corsOption = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};




// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'jonasali0900@gmail.com', // your email address
//     pass: 'abcd1234ABCD!@#$' // your email password
//   }
// });

// app.post('/send-email', (req, res) => {
//   const { to, subject, text } = req.body;

//   const mailOptions = {
//     from: 'jonasali0900@gmail.com', // sender address
//     to: to, // list of receivers
//     subject: subject, // Subject line
//     text: text // plain text body
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).send(error.toString());
//     }
//     res.status(200).send('Email sent: ' + info.response);
//   });
// });














app.use(cors(corsOption));
// Router
const Route = require("./routes/index");

// Database connect function
const connectdb = require("./config/db");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect DB
connectdb();

// Use routes
app.use("/v1/api", Route);

// enable CORS without external module

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () =>
  console.log(`Testimonials API is now running on port ${port}`)
);
