const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    // cart: {
    //   type: Array,
    //   default: [],
    // },
    // address: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Address',
    //   },
    // ],
    address: [
      {
        pincode: {
          type: Number,
          required: true,
        },
        locality: {
          type: String,
          required: true,
        },
        area: {
          type: String,
          required: true,
        },
        district: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        // userId: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: 'User',
        // },
      },
    ],
    // wishlist: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Product',
    //   },
    // ],
    coupons: [
      {
        code: {
          type: String,
          // unique: true,
          required: true,
        },
        timesUsed: {
          type: Number,
        },
      },
    ],
    // refreshToken: {
    //   type: String,
    // },
  },
  {
    timestamps: true,
  }
);

// eslint-disable-next-line func-names
userSchema.pre('save', async function () {
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hashSync(this.password, salt);
});

// eslint-disable-next-line func-names
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Export the model
module.exports = mongoose.model('User', userSchema);
