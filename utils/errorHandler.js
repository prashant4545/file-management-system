// successResponse.js
const successResponse = (res, statusCode, data) => {
    return res.status(statusCode).json({
        success: true,
        data,
    });
};

// handleError.js
const handleError = (res, error) => {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
};

module.exports = {
    successResponse,
    handleError,
};
