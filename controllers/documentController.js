const Document = require('../models/documentModel');
const Folder = require('../models/folderModel');
const { handleError, successResponse } = require('../utils/errorHandler');

// Get document details including versions
const getDocumentDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const document = await Document.findById(id).populate('versions');
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        return successResponse(res, 200, document);
    } catch (error) {
        handleError(res, error);
    }
};

// Create a new document
const createDocument = async (req, res) => {
    const { title, content, folder } = req.body;
    const file = req.file;  // Multer automatically handles the file upload

    try {
        // Validate inputs
        if (!title || !content || !folder) {
            return res.status(400).json({ message: 'Title, content, and folder are required' });
        }

        if (!file) {
            return res.status(400).json({ message: 'Document file is required' });
        }

        // Create a new document entry
        const document = new Document({
            title,
            content,
            folder,
            fileUrl: `https://storage.example.com/uploads/${file.filename}`,  // Store the file URL
            user: req.user._id,
            versions: [
                {
                    version: '1.0',
                    fileUrl: `https://storage.example.com/uploads/${file.filename}`, // Store the file URL
                    uploadedAt: new Date(),
                }
            ],
        });

        // Save the document to the database
        await document.save();

        return res.status(201).json({ message: 'Document created successfully', document });
    } catch (error) {
        // console.error(error);
        handleError(res, error);
    }
};

const createDocumentVersion = async (req, res) => {
    const { versionNumber } = req.body;
    const file = req.file;  // Multer automatically handles the file upload
    const documentId = req.params.id;

    try {
        // Validate the inputs
        if (!versionNumber || !file) {
            return res.status(400).json({ message: 'Version number and document file are required' });
        }

        // Find the document by ID
        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check the latest version number and increment it
        const latestVersion = document.versions[document.versions.length - 1];
        const newVersionNumber = parseFloat(latestVersion.version) + 0.1;  // Incrementing version number (e.g., 1.0 -> 1.1)

        // Add the new version to the document
        document.versions.push({
            version: newVersionNumber.toFixed(1),
            fileUrl: `https://storage.example.com/uploads/${file.filename}`,
            uploadedAt: new Date(),
        });

        // Update the document
        await document.save();

        return res.status(200).json({
            message: 'Document version created successfully',
            documentId: document._id,
            version: newVersionNumber.toFixed(1),
            fileUrl: `https://storage.example.com/uploads/${file.filename}`,
            uploadedAt: new Date(),
        });
    } catch (error) {
        // console.error(error);
        handleError(res, error);
    }
};


// Get all versions of a document
const getDocumentVersions = async (req, res) => {
    const { id } = req.params;
    try {
        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        return successResponse(res, 200, document.versions);
    } catch (error) {
        handleError(res, error);
    }
};

// Update document details
const updateDocument = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const document = await Document.findByIdAndUpdate(
            id,
            { title, content },
            { new: true }
        );

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        return successResponse(res, 200, document);
    } catch (error) {
        handleError(res, error);
    }
};

// Delete a document and all its versions
const deleteDocument = async (req, res) => {
    const { id } = req.params;
    try {
        const document = await Document.findByIdAndDelete(id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        return successResponse(res, 200, { message: 'Document deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

const filterDocuments = async (req, res) => {
    const { search } = req.query; // Search term from query params

    try {
        // Find documents that match the search term in title or content
        const documents = await Document.find({
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ]
        });

        // Function to recursively find the folder path
        const getFolderPath = async (folderId) => {
            let folder = await Folder.findById(folderId);
            let path = folder ? folder.name : '';
            while (folder && folder.parentFolder) {
                folder = await Folder.findById(folder.parentFolder);
                path = folder ? folder.name + '/' + path : path;
            }
            return path;
        };

        // Add folderPath to each document
        const documentsWithPath = [];
        for (let doc of documents) {
            const folderPath = await getFolderPath(doc.folder);
            documentsWithPath.push({
                id: doc._id,
                title: doc.title,
                folderPath: folderPath || 'Root', // Default to 'Root' if no path is found
            });
        }

        return successResponse(res, 200, documentsWithPath);
    } catch (error) {
        handleError(res, error);
    }
};

// Get total document count for the authenticated user
const getTotalDocumentCount = async (req, res) => {
    try {

        const totalDocuments = await Document.countDocuments({ user: req.user._id });

        return successResponse(res, 200, { totalDocuments });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    getDocumentDetails,
    createDocument,
    createDocumentVersion,
    getDocumentVersions,
    updateDocument,
    deleteDocument,
    filterDocuments,
    getTotalDocumentCount
};
