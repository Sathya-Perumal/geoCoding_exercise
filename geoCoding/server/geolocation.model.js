const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let geoLocation = new Schema({
    "geoLocation_name": {
        type: String
    },
    "geoLocation_desc": {
        type: String
    },
    "geoLocation_loc": {
         type: [Number], index: '2dsphere'
    }
});

module.exports = mongoose.model('geoLocation', geoLocation);