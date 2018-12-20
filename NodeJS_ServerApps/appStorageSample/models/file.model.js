const mongoose = require('mongoose');

//https://grokonez.com/node-js/nodejs-express-mongodb-one-to-many-related-models
//[RAW_FILE
const RawFileSchema = mongoose.Schema({
    name: String,
    contentType:String,
    data: Buffer
}, {
    timestamps: true
});
exports.rawFile = mongoose.model('RawFile', RawFileSchema);
//RAW_FILE]

//[THUMBNAIL
const ThumbnailSchema = mongoose.Schema({
    name: String,
    contentType:String,
    data: Buffer,
    rawFile : { type: mongoose.Schema.Types.ObjectId, ref: 'RawFile' },
}, {
    timestamps: true
});
exports.thumbnail = mongoose.model('Thumbnail', ThumbnailSchema);
// THUMBNAIL]

//[META_FILE
const MetaFileSchema = mongoose.Schema({
    name: String,
    itemId: String,
    description: String,
    category: String,
    tags: String,
    rawFile : { type: mongoose.Schema.Types.ObjectId, ref: 'RawFile' },
    thumbnail : { type: mongoose.Schema.Types.ObjectId, ref: 'Thumbnail' }
}, {
    timestamps: true
});
exports.metaFile = mongoose.model('MetaFile', MetaFileSchema);
//META_FILE]
