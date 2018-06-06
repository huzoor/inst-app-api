var mongoose = require('mongoose'); //Import the mongoose module
require('dotenv').config();

//Set up default mongoose connection
var db = mongoose.createConnection(process.env.MONGODB_CONNECT_URI, { useMongoClient: true });
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;