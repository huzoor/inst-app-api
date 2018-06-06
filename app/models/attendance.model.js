//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var AttendanceSchema = new Schema({ 
    presentiesList: Array,
    attendanceTakenBy: String,
    instituteUserName: String,             
    schoolUserName: String,
    createdOn: Date,
}, { collection: 'attendance' });

var AttendanceModel = db.model('attendance', AttendanceSchema );
module.exports = AttendanceModel;


// presentiesList:[
//    {classCode, subjectCode,  studentsList:[]}
// ]