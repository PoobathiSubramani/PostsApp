const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {type: String,  required: true},
  content: {type: String, required: true},
  imagePath: {type: String, required: true}
});

module.exports = mongoose.model('post', postSchema);
//the collection name of the db would be the plural form of the module name, here it is Post then the collection -> posts


