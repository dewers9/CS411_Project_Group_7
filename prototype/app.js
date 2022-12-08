var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


const app = express();
const session = require('express-session');

require('dotenv').config()


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}))

app.get('/', function(req, res) {
  res.render('index');
});

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));

var passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => {
  res.render('loggedIn', {user: userProfile});
});
app.get('/error', (req, res) => res.send("error logging in"));
 
passport.serializeUser(function(user, cb) {
  cb(null, user);
});
 
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Google OAuth
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.ourGoogleClientId || process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.ourGoogleClientSecret || process.env.GOOGLE_CLIENT_SECRET

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });



app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'a1cb3111dfmsh2893a6db0c8f817p1a7159jsn8ad70e2df482',
		'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
	}
};

function searchByIngredient(ingredients){
  //    Parse Ingredients into list and trim whitespaces
  ingredients = ingredients.split(",")
  for(i in ingredients){
    ingredients[i] = ingredients[i].trim()
  }

  //    Combine and format ingredients for api call
  ingredient_string = ingredients.join("%2C")
  
  let result_lim = '2'
  let ignorePantry = 'true'
  let rankings = '1'

  let url =  'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=' + ingredient_string + '&number=' + result_lim + '&ignorePantry=' + ignorePantry + '&ranking=' + rankings
  console.log(url)
  
  let x = get_promise(url)
  console.log(x)
  console.log(x.then((result) => set_results(result)))
  console.log(x.then((result) => console.log(result)))

}

async function get_promise(url){
  let x = await fetch(url,options).then(response => response.json())
  return x
}

function set_results(new_val){
  let temp
  let res = document.getElementById('results')

  for(i in new_val){
    temp = document.createElement("li")
    temp.innerHTML = JSON.stringify(new_val[i])
    res.appendChild(temp)
  }
  
}


//  Get the modal(login popup)
//var modal = document.getElementById('id01')

// When the user clicks anywhere outside of the modal, close it
//window.onclick = function(event) {
//  if (event.target == modal) {
//    modal.style.display = "none"
//  }
//}
