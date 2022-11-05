// ObjectId() method for converting studentId string into an ObjectId for querying database
const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

module.exports = {
  // Get all users
  getAllUsers(req, res) {
    User.find()
      .select('-__v')
      .then(async (users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // Get one user by id
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate('thoughts')
      .populate('friends')
      .select('-__v')
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
      .select('-__v')
      .then(async (user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Update a user by id
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'Must input username!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a user by id
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Add a friend to a user's friend list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .populate('friends')
      .then((friend) =>
        !friend
          ? res.status(404).json({ message: 'No user with that id!' })
          : res.json(friend)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a friend from a user's friend list
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .populate('friends')
      .then((friend) =>
        !friend
          ? res.status(404).json({ message: 'No user with that id!' })
          : res.json(friend)
      )
      .catch((err) => res.status(500).json(err));
  },
};
