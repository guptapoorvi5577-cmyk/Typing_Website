//import model
const Score = require('../models/Score');

exports.getLatestScore = async(req, res)=>{

    try{

        const userId = req.user.id;

        const userRecord = await Score.findOne(
            {userId: userId},
            {scoreHistory: {$slice: -1}}
        );

        if(!userRecord || userRecord.scoreHistory.length === 0){

            return res.status(404).json({
                success: false,
                message: 'No data is present'
            });

        }

        res.status(200).json({
            success: true,
            message: 'data found',
            data: userRecord.scoreHistory[0]
        })

    }
    catch(err){

        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }

}