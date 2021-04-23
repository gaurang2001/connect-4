var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20');
const keys = require("./keys")
const User = require("../models/users")

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
        console.log('passport callback function fired')
        console.log(profile)
        User.findOne({email:profile.emails[0].value}).then((currentUser) => {
            if (currentUser) {
                console.log("User Exists: " + currentUser)
                done(null, currentUser)
            } else {
                new User({
                    email: profile.emails[0].value,
                    password: profile.id
                }).save().then((newUser) => {
                    console.log('new User created: ' + newUser)
                    done(null, newUser)
                })
            }
        })
        
  }
));