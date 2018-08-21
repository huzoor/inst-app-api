//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var LeaveSchema = new Schema({
    appliedBy: String,
    appliedUser: String,
    userRole: String,
    fromDate: Date,
    toDate: Date,            
    reason: String,
    instituteUserName: String,             
    schoolUserName: String,
    staffId: String,
    approvedBy: String,
    approvedUser: String,
    rejectedBy: String,
    rejectedUser: String,
    deletedBy: String,
    deletedUser: String,
    status: String,
    isApproved: Boolean,
    createdOn: Date,
}, { collection: 'leaves' });

var TimelineModel = db.model('leaves', LeaveSchema );
module.exports = TimelineModel;

