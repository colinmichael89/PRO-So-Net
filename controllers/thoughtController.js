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
};
