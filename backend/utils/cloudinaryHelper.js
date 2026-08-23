import cloudinary from '../config/cloudinary.js';

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} buffer - File buffer from multer
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise<String>} - Secure URL of the uploaded file
 */
export const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'auto' }, // auto handles pdf/doc as 'raw' or 'image' if possible
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
    });
};
