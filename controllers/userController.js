// ObjectId() method for converting studentId string into an ObjectId for querying database
const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

module.exports = {
  // Get all users
  getAllUsers(req, res) {
    User.find()
      .then(async (users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // Get one user by id
  getSingleUser(req, res) {
    User.FindOne({ _id: req.params.ObjectId })
      .populate('thoughts')
      .populate('friends')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user found with this id!' })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Create a new user
  createNewUser(req, res) {
    User.create(req.body)
      .populate('thoughts')
      .populate('friends')
      .then(async (user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Update a user by id
  updateUser(req, res) {
    User.FindOneAndUpdate(
      { _id: req.params.ObjectId },
      { $set: { username: req.body } },
      { runValidators: true, new: true }
    )
      .populate('thoughts')
      .populate('friends')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'Must input username!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a user by id
  deleteUser(req, res) {
    User.FindOneAndDelete({ _id: req.params.ObjectId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
