var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    uid: String,
    img: {
        data: String,
        contentType: String,
    },
});
var userSchema = new mongoose.Schema({
    uid: String,
    created: {
        type: Date,
        default: Date.now,
    },
    modified: {
        type: Date,
        default: Date.now,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    name: String,
    email: String,
    pass: String,
});

var storageSchema = new mongoose.Schema({
    uid: String,
    imgs: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 10'],
    },
    ttlImgs: {
        type: Number,
        default: 0,
    },
});
function arrayLimit(val) {
    return val.length <= 10;
}
module.exports = {
    imageSchema: new mongoose.model('image', imageSchema, 'tempImages'),
    userSchema: new mongoose.model('user', userSchema, 'users'),
    storageSchema: new mongoose.model('storage', storageSchema, 'storage'),
};
