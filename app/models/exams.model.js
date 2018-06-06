//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var ExamsSchema = new Schema({
    testName : String,
    instituteUserName: String,             
    schoolUserName: String,
    createdOn: Date,
}, { collection: 'exams' });

var ExamsModel = db.model('exams', ExamsSchema );
module.exports = ExamsModel;

