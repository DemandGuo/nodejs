// services/image.service.js
const sharp = require('sharp');
const path = require('path');
const UPLOAD_ROOT = path.join(process.cwd(), 'uploads');

module.exports = {
    async generateThumbnail(file) {
        const thumbnailName = `thumb-${file.filename}`;
        const thumbnailPath = path.join(UPLOAD_ROOT, thumbnailName);
        await sharp(file.path).resize(200, 200).toFile(thumbnailPath);
        return thumbnailName;
    }
};