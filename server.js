const express = require('express'); //the '' is in the node_modules folder.
const app = express(); //Creates a new instance of express
const mongoose = require('mongoose'); //The '' is in the node_modules folder
const methodOverride = require('method-override'); //Needed with a form for any request other than a POST request.
const expressLayouts = require('express-ejs-layouts'); //Ability to add partials...like a template
const PORT = 3000;

const mongoURI = 'mongodb://localhost:27017/mongoRelationships'; //mongoRelationships is the name of the MongoDB db

mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('the connection with mongod is established');
  }
);

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false })); //Body parser which allows the form to be stored in various variables for manipulation
app.use(express.static('public')); //Created 'public' folder to store images, css, etc.
app.use(methodOverride('_method')); //

// ABOVE our app.get()
app.use('/users', require('./controllers/usersController')); //Puts /users before every route in the controller file


app.get('/', (req, res) => {
  res.render('home.ejs'); //Basically the home page
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});