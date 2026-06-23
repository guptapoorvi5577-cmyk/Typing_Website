const Score = require('../models/Score');

exports.getProfileStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRecord = await Score.findOne({ userId });

    if (!userRecord || userRecord.scoreHistory.length === 0) {
      return res.status(404).json({ success: false, message: 'No data found' });
    }

    const history     = userRecord.scoreHistory;
    const testsTaken  = history.length;
    const bestWpm     = Math.max(...history.map(s => s.wpm));
    const avgWpm      = Math.round(history.reduce((a, s) => a + s.wpm, 0) / testsTaken);
    const avgAccuracy = Math.round(history.reduce((a, s) => a + s.accuracy, 0) / testsTaken * 10) / 10;
    const last5       = history.slice(-5).reverse().map(s => ({ wpm: s.wpm, accuracy: s.accuracy }));

    res.status(200).json({
      success: true,
      data: { testsTaken, bestWpm, avgWpm, avgAccuracy, last5 }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
