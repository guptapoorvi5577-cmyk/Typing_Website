const mongoose = require('mongoose');

require('dotenv').config();
console.log(process.env.DATABASE_URL)

exports.connect = ()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{console.log('DB connected')})
    .catch((err)=>{
            console.log('DB connection issue');
            console.error(err);
            process.exit(1);
    })
}