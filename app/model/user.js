// grab the things we need
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/sweetsmile');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  email: String,
  phone: String,
  created_at: Date,
  updated_at: Date,
  id: String
});

// custom method to add string to end of name
// you can create more important methods like name validations or formatting
// you can also do queries and find similar users 
// userSchema.methods.check_login = function() {

// };

// on every save, add the date
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
    if(candidatePassword.localeCompare(this.password)==0) {
        return 1;   
    }else{
    	return 0;
    }
};


// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;