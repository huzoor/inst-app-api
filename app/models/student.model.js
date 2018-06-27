//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var StudentSchema = new Schema({
    name: String, 
    password : String,  
    email : String, 
    mobile : String,
    logo : String,  
    gender: String,
    dob: Date, 
    rollNumber: String, 
    classEnrolled: Schema.Types.ObjectId, 
    schoolUserName : String,
    instituteUserName : String,
    userName: String,  
    fatherName: String, 
    motherName: String, 
    address : String, 
    city : String, 
    district: String,
    state : String, 
    country: String,
    pinCode : String, 
    attachments: Array,  
    isAvailable: Boolean, 
}, { collection: 'students' });

var StudentModel = db.model('students', StudentSchema );
module.exports = StudentModel;

