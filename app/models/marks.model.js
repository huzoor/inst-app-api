//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var MarksSchema = new Schema({ 
    classId: String,
    subjectId: String,
    examType: String,
    instituteUserName: String,
    schoolUserName: String,
    marksObtained: Array,
    createdOn: Date,
}, { collection: 'marks' });

var MarksModel = db.model('marks', MarksSchema );
module.exports = MarksModel;