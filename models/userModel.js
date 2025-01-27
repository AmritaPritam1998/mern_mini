const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   phoneno: Number,
// });
// module.exports = mongoose.model('User', UserSchema);
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileno: { type: Number, required: true },
  confirmpassword: { type: String, required: true },
  
});
module.exports = mongoose.model('User', UserSchema);