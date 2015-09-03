var login = require('./login');
var User = require('../models/User');

module.exports = function(passport) {
  passport.serializeUser(function(user, done){
    console.log('serialize user: ', user);
    return done(null, user._id);
  });
  passport.deserializeUser(function(id, done){
    return User.findById(id, function(err, user){
      console.log('deserialize user: ', user);
      done(err, user);
    });
  });
  return login(passport);
}
