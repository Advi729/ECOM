const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    addresses: [
      {
        pincode: {
          type: String,
          required: true,
        },

        locality: {
          type: String,
          required: true,
          trim: true,
        },

        area: {
          type: String,
          required: true,
          trim: true,
        },

        district: {
          type: String,
          required: true,
          trim: true,
        },

        state: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);