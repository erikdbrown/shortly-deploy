var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  timestamps: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  this.hashPassword();
  next();
})

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      // this.set('password', hash);
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
