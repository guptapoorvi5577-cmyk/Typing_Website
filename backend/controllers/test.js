//import model
const Score = require('../models/Score');

exports.test = async(req, res)=>{

    try{

        //wpm and accuracy
        const {wpm, accuracy, duration, paragraphId} = req.body;

        const userId = req.user.id;

        const newResult = {wpm, accuracy, duration, paragraphId};

        const response = await Score.findOneAndUpdate(

            {userId: userId},
            {$push: {scoreHistory: newResult}},
            {new: true, upsert: true}


        )

        res.status(200).json({
            success: true,
            data: response,
            message: 'score added'
        });

    }
    catch(err){

        console.error(err);

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }
    exports.getLatestScore = async(req, res)=>{

    try{

        const userId = req.user.id;

        const scoreDoc = await Score.findOne({ userId });

        if(!scoreDoc || scoreDoc.scoreHistory.length === 0){
            return res.status(200).json({
                success: true,
                data: null,
                message: 'no scores yet'
            });
        }

        const latest = scoreDoc.scoreHistory[scoreDoc.scoreHistory.length - 1];

        res.status(200).json({
            success: true,
            data: latest,
            message: 'fetched'
        });

    }
    catch(err){

        console.error(err);

        res.status(500).json({
            success: false,
            message: 'internal server error'
        })

    }

}

}