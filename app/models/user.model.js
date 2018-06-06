//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var UsersSchema = new Schema({
    name: String,
    username: String,
    institute: String,
    role: String
}, { collection: 'users' });

var UserModel = db.model('users', UsersSchema );
module.exports = UserModel;