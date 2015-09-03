var mongoose = require('mongoose');

UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  createDate: Date
});

module.exports = mongoose.model('User', UserSchema);