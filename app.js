const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./utils/errorHandler');
const documentRoutes = require('./routes/documentRoutes');  // Use documentRoutes for all routes

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/file-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));

// Routes
app.use('/api/documents', documentRoutes);  // All document-related routes will be handled by documentRoutes

// Error handling middleware
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
