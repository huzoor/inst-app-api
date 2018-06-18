//Require Mongoose
var mongoose = require('mongoose');
var db = require('../../dbConnection');
//Define a schema
var Schema = mongoose.Schema;

var GallerySchema = new Schema({
    title: String,
    description: String,
    imageLocation: String,
    image: String,             
    entityType: String,
    createdOn: Date,
}, { collection: 'gallery' });

var GalleryModel = db.model('gallery', GallerySchema );
module.exports = GalleryModel;

