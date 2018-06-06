//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var HoursSchema = new Schema({ 
    hourName: String,
    instituteUserName: String,
    associatedWith: Array,
    startTime: Date,
    endTime: Date,
    createdOn: Date,
}, { collection: 'hours' });

var HoursModel = db.model('hours', HoursSchema );
module.exports = HoursModel;