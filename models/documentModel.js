const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
    version: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

const documentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        folder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Folder',
            required: true,
        },
        fileUrl: {
            type: String,
            default: null,
        },
        versions: [versionSchema],
    },
    { timestamps: true }
);
// Adding index to folder field for performance
documentSchema.index({ folder: 1 });

module.exports = mongoose.model('Document', documentSchema);
