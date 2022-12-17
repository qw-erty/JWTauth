const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const path = require("path");

const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

app.use(cors());

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

require('dotenv').config()

// database connection
const dbURI = process.env.MONGO_URL;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/upload', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);
app.get('/success', (req, res) => res.render('success'));
const csvRoutes = require("./routes/csvRoutes");

app.use("/api/uploadCsv", csvRoutes);
app.use("/public", express.static(path.join(__dirname, "public")));