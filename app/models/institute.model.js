//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var InstituteSchema = new Schema({
    instituteName : String, 
    code : String, 
    password: String,
    registeredDate : Date, 
    schoolsRegistered : Number, 
    logo : String, 
    address : String, 
    city : String, 
    district: String,
    state : String, 
    country : String, 
    instituteAdminName : String, 
    userName : String,  
    email : String, 
    mobile : Number, 
    isAvailable: Boolean,
    // Classes: Array,
    // Subjects: Array,
},{ collection: 'institutes' });

var InstituteModel = db.model('institute', InstituteSchema );
module.exports = InstituteModel;