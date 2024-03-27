const { mongoose } = require('../config/db');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, user) {
        delete user.password;
        delete user.__v;
        return user;
      },
    },
  }
);

module.exports = mongoose.model('User', UserSchema);
