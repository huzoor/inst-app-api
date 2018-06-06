//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var SubjectsSchema = new Schema({ 
    subjectName: String,
    instituteUserName: String, 
    schoolUserName: String, 
    associatedWith: Array,
    createdOn: Date,
}, { collection: 'subjects' });

var SubjectsModel = db.model('subjects', SubjectsSchema );
module.exports = SubjectsModel;