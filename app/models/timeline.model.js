//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var TimelineSchema = new Schema({
    messageType: String,
    message: String,
    messageTo: String,
    instituteUserName: String,             
    schoolUserName: String,
    addedUser: String,  
    addedBy: String,             
    createdOn: Date,
}, { collection: 'timeline' });

var TimelineModel = db.model('timeline', TimelineSchema );
module.exports = TimelineModel;

