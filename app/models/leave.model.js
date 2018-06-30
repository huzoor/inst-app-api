//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var LeaveSchema = new Schema({
    appliedBy: String,
    userRole: String,
    fromDate: Date,
    toDate: Date,            
    reason: String,
    instituteUserName: String,             
    schoolUserName: String,
    approvedBy: String,
    rejectedBy: String,
    deletedBy: String,
    status: String,
    isApproved: Boolean,
    createdOn: Date,
}, { collection: 'leaves' });

var TimelineModel = db.model('leaves', LeaveSchema );
module.exports = TimelineModel;

