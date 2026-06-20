const mongoose = require("mongoose");
const Paragraph = require("./Paragraph");

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scoreHistory: [
      {
        wpm: {
          type: Number,
          required: true,
        },
        accuracy: {
          type: Number,
          required: true,
        },
        duration:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Paragraph',
          required: true
        },
        paragraphId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Paragraph',
          required: true
        }
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("score", scoreSchema);