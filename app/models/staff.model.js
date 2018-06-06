//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var StaffSchema = new Schema({
    staffName: String,
    userName : String,  
    password : String,  
    email : String, 
    mobile : String,
    photoPath : String,  
    gender: String,
    staffRole: String,
    qualification: String,
    experience: String,
    subject: Schema.Types.ObjectId,
    yearOfPassing: String,
    schoolUserName : String, 
    instituteUserName : String, 
    address : String, 
    city : String, 
    district: String,
    state : String, 
    country : String, 
    pinCode : String, 
    attachments: Array,
    isAvailable : Boolean, 
}, { collection: 'staff' });

var StaffModel = db.model('staff', StaffSchema );
module.exports = StaffModel;

