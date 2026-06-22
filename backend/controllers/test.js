const Score = require('../models/Score');

exports.test = async (req, res) => {
  try {
    const { wpm, accuracy, duration, paragraphId } = req.body;
    const userId = req.user.id;

    const newResult = { wpm, accuracy, duration, paragraphId };

    const response = await Score.findOneAndUpdate(
      { userId },
      { $push: { scoreHistory: newResult } },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: response, message: 'score added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

