const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    parentFolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null // Root-level folders have no parent
    }
}, { timestamps: true });

// Adding index to parentFolder for performance
folderSchema.index({ parentFolder: 1 });

module.exports = mongoose.model('Folder', folderSchema);

