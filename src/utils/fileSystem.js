const fs = require('fs');

/**
 * Deletes a file at the specified filePath.
 * @param {string} filePath - The path of the file to be deleted.
 * @returns {boolean} Returns true if the file is successfully deleted, otherwise throws an error.
 * @throws {Error} Throws an error if there is an issue deleting the file.
 * @example
 * deleteFile('/path/to/file.txt')
 *   .then(result => console.log(result)) // Output: true
 *   .catch(error => console.error(error));
 */
exports.deleteFile = (filePath) => {
    try {
        // Attempt to delete the file synchronously
        fs.unlinkSync(filePath);
        return true;
    } catch (error) {
        // Log the error and re-throw it
        console.error('Error during delete file:', error);
        // throw error;
    }
};