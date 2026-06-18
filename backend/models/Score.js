const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  scoreHistory: [
    {
      score: { type: Number, required: true },
      playedTime: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("score", scoreSchema);
