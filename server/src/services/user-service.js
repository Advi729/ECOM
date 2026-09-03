const User = require('../models/user-model');

const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

const findUserById = async (userId) => {
  return User.findById(userId);
};

const findUsers = async () => {
  return User.find();
};

module.exports = {
  findUserByEmail,
  findUserById,
  findUsers,
};