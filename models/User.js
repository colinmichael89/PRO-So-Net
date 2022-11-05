const { Schema, Types, model } = require('mongoose');
const Thought = require('./Thought');

import { isEmail } from 'validator';

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: 'Email address is required!',
      unique: true,
      validate: {
        validator: isEmail,
        message: 'Please enter a valid email',
        // isAsync: false,
      },
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        // self reference
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// Virtual for friend count
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;
