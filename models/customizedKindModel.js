const mongoose = require('mongoose');

const customizedKindSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    name: String,
});

const CustomizedKind = mongoose.model('CustomizedKind', customizedKindSchema);

module.exports = CustomizedKind;