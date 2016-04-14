// grab the things we need
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/sweetsmile');
// var Schema = mongoose.Schema;
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/sweetsmile');
var Schema = mongoose.Schema;

// create a schema
var friendSchema = new Schema({
  username: { type: String, required: true},
  friend_id: { type: String, required: true },
  created_at: Date,
  updated_at: Date
});

friendSchema.index({username: 1, friend_id: 1}, {unique: true});
// custom method to add string to end of name
// you can create more important methods like name validations or formatting
// you can also do queries and find similar users 
// userSchema.methods.check_login = function() {

// };

// on every save, add the date
friendSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// friendSchema.methods.getFriends = function(username) {
//     Friend.find({ username: username }).exec(function(err, users) {
//       if (err) throw err;
//       return users;
//     });
// };


// the schema is useless so far
// we need to create a model using it
var Friend = mongoose.model('Friend', friendSchema);

// make this available to our users in our Node applications
module.exports = Friend;