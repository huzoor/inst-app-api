//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var ClassesSchema = new Schema({ 
    className: String,
    instituteUserName: String,
    schoolUserName: String,
    associatedWith: Array,
    createdOn: Date,
}, { collection: 'classes' });

var ClassesModel = db.model('classes', ClassesSchema );
module.exports = ClassesModel;