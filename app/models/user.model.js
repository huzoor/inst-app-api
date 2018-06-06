//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var UsersSchema = new Schema({
    name: String,
    username: String,
    password: String,
    role: String,
    isAvailable : Boolean,
}, { collection: 'users' });

var UserModel = db.model('users', UsersSchema );
module.exports = UserModel;