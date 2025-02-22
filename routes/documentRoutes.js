const express = require('express');
const documentController = require('../controllers/documentController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

const router = express.Router();

// POST /login: Login route to authenticate and return a JWT token
router.post('/login', authController.login);

// Set up file upload storage using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Routes for document management
router.get('/:id', authMiddleware, documentController.getDocumentDetails);
router.post('/', authMiddleware, upload.single('file'), documentController.createDocument);
router.post('/:id/version', authMiddleware, upload.single('file'), documentController.createDocumentVersion);
router.get('/:id/versions', authMiddleware, documentController.getDocumentVersions);
router.put('/:id', authMiddleware, documentController.updateDocument);
router.delete('/:id', authMiddleware, documentController.deleteDocument);
router.get('/filter', authMiddleware, documentController.filterDocuments);
router.get('/total-documents', authMiddleware, documentController.getTotalDocumentCount);


module.exports = router;
