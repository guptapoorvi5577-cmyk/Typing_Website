//import model
const Paragraph = require("../models/Paragraph");

exports.addParagraph = async (req, res) => {
  try {
    const { text, difficulty, duration } = req.body;

    if (!text || !difficulty || !duration) {
      return res.status(400).json({
        success: false,
        message: "all feild required",
      });
    }

    const newPara = await Paragraph.create({ text, difficulty, duration });

    res.status(200).json({
      success: true,
      data: newPara,
      message: "paragraph added successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

//random paragraph

exports.getRandomParagraph = async (req, res) => {
  try {
    const userDifficulty = req.query.level || "easy";
    const userDuration = parseInt(req.query.time) || 60;

    const randomPara = await Paragraph.aggregate([
      {
        $match: {
          difficulty: userDifficulty,
          duration: userDuration,
        },
      },
      { $sample: { size: 1 } },
    ]);

    if(randomPara.length === 0){

        return res.status(404).json({
            success: false,
            message: 'No para found'
        });

    }

    res.status(200).json({
        success: true,
        message: 'Random paragraph',
        data: randomPara[0],
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
