require('dotenv').config()
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require('express-session');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({   
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
  }));
  

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/researcher",(req,res)=>{
    res.render("researcher");
});

app.get("/sme",(req,res)=>{
    res.render("sme");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get('/register',(req,res)=>{
    res.render('register');
});

// Google Authentication

/*  PASSPORT SETUP  */

const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
}); 


/*  Google AUTH  */
 
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",passReqToCallback:true
    },
    function(request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
)); 

app.get("/failed", (req, res) => {
    res.render('error.ejs');
})
app.get("/user/dashboard", (req, res) => {
    res.render('dashboard');
})

app.get('/auth/google',
    passport.authenticate('google', {
            scope:
                ['email', 'profile']
        }
    ));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
    }),
    function (req, res) {
        res.redirect('/user/dashboard')

    }
);

// LinkedIn Authentication




app.listen(3000,function(){
    console.log("Server Started at 3000");
});

