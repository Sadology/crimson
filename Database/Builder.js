const mongoose = require('mongoose')
const mongoPath = process.env.mongoPath

module.exports = {
    init: () => {
    const dbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
      
    mongoose.connect(mongoPath, dbOptions);
    mongoose.Promise = global.Promise;
    
    mongoose.connection.on('connected', () => {
        console.log('🟢 Database online');
    });
    
    mongoose.connection.on('err', err => {
        console.error(`🔴 Database error: \n ${err.stack}`);
    });
    
    mongoose.connection.on('disconnected', () => {
        console.log('⚫ Database offline');
    })
  }
};