// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email:{
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /.+\@.+\..+/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, 

  },
  role: {
    type: String,
    enum: ['customer', 'staff'],
    required: true,
    default: 'customer',

  },
}, {
  timestamps: true 
});

const User = mongoose.model('User', userSchema);

export default User;
