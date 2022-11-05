const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

module.exports = {
  getAllThoughts(req, res) {
    Thought.find()
      .populate('reactions')
      .then(async (thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  getSingleThought(req, res) {
    Thought.FindOne({ _id: req.params.thoughtId })
      .populate('reactions')
      .then(async (thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought found with this id!' })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Create a new thought
  createNewThought(req, res) {
    Thought.post(req.body)
      .then(async (thought) =>
        !thought
          ? res.status(404).json({ message: 'Must input thought!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Update a thought by id
  updateThought(req, res) {
    Thought.put(
      { _id: req.params.thoughtId },
      { $set: { thoughtText: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'Must input thought!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a thought by id
  deleteThought(req, res) {
    Thought.deleteOne({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought found with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a reaction
  createReaction(req, res) {
    Thought.post(
      { _id: req.params.reactionId },
      { $push: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: 'Must input reaction!' })
          : res.json(reaction)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.reactionId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: 'No reaction found with this id!' })
          : res.json(reaction)
      )
      .catch((err) => res.status(500).json(err));
  },
};
