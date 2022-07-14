const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    contestId: { type: String, required: true, unique: true },
    index: { type: Array, required: true },
    tags: { type: Array, required: true },
}, {
    timestamps: true
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;