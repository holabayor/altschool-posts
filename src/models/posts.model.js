const { mongoose } = require('../config/db');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, post) {
        delete post.__v;
      },
    },
  }
);

module.exports = mongoose.model('Post', PostSchema);
