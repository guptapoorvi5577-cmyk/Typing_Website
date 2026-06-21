const Score = require('../models/Score');

exports.leaderBoard = async(req, res)=>{

    try{

        const currentUserId = req.user.id;

        const scores = await Score.aggregate([

            {$unwind: '$scoreHistory'},
            {
                $group:{
                    _id: '$userId',
                    highestWpm: {$max: '$scoreHistory.wpm'},
                }
            },
            {$sort: {highestWpm: -1}},
            {
                $lookup:{
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {$unwind: '$userInfo'},
            {
                $project:{
                    _id: 0,
                    userId: '$_id',
                    name: '$userInfo.name',
                    wpm: '$highestWpm'
                }
            }

        ]);

        let myRank = 'Unranked';

        const leaderBoardRanks = scores.map((user, index)=>{

            const rank = index + 1;

            if(user.userId.toString() === currentUserId){
                myRank = rank;
            }

            return {...user, rank: rank};

        })

        res.status(200).json({
            success: true,
            data:{
                leaderboard: leaderBoardRanks,
                myRank: myRank
            },
            message: 'fetched'
        });

    }
    catch(err){
        
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'internal server error'
        })

    }
    
}