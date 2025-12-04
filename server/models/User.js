const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
      required: true,
    },
    photo: {
      type: String,
      default: '', // Optional, can be empty string if not provided
      // Ideally store URLs of images (e.g., uploaded to cloud storage)
    },
    faceDescriptor: {
      type: [Number], // Array of 128 floats
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length === 128 || arr.length === 0;
        },
        message: 'Face descriptor must be an array of 128 numbers',
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
