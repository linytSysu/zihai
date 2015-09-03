var User = require('../models/User');
var bcryptNodejs = require('bcrypt-nodejs');
var passportLocal = require('passport-local');
var LocalStrategy = passportLocal.Strategy;

function hash(password) {
  return bcryptNodejs.hashSync(password, bcryptNodejs.genSaltSync(10), null);
}