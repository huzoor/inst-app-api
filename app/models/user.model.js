//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var UsersSchema = new Schema({
    name: String,
    userName: String,
    password: String,
    role: String,
    logo: String,
    mobile: String,
    email: String,
    isAvailable : Boolean,
}, { collection: 'users' });

var UserModel = db.model('users', UsersSchema );
module.exports = UserModel;