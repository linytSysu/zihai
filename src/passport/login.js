var User = require('../models/User');
var bcryptNodejs = require('bcrypt-nodejs');
var passportLocal = require('passport-local');
var LocalStrategy = passportLocal.Strategy;

function isValidPassword(user, password) {
  return bcryptNodejs.compareSync(password, user.password);
}

module.exports = function(passport) {
  passport.use('login', new LocalStrategy({passReqToCallback: true},
    function(req, username, password, done) {
      User.findOne({username: username}, function(err, user) {
        var msg;
        if (err) {
          return console.log("Error in login: ", err), done(err);
        }
        if (!user) {
          console.log(msg = "Can't find user: " + username);
          return done(null, false, req.flash('message', msg));
        } else if (!isValidPassword(user, password)) {
          console.log(msg = "Invalid password");
          return done(null, false, req.flash('message', msg));
        } else {
          return done(null, user);
        }
      });
    }
  ));
};
