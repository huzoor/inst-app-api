//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var SchoolSchema = new Schema({
    schoolName : String, 
    instituteUserName : String, 
    code : String, 
    registeredDate : Date, 
    logo : String,
    address : String, 
    city : String, 
    district: String,
    state : String, 
    country : String, 
    userName : String,  
    password : String,  
    email : String, 
    mobile : String, 
    isAvailable: Boolean,
},{ collection: 'schools' });

var SchoolModel = db.model('schools', SchoolSchema );
module.exports = SchoolModel;