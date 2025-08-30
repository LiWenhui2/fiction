const multer = require('multer');
const path = require('path');

// 存储配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/avatars')); // 存到 uploads/avatars 目录下
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // 保留原扩展名
        const filename = `${Date.now()}-${Math.floor(Math.random() * 1E9)}${ext}`; // 防重名
        cb(null, filename);
    }
});

// 只允许上传图片（jpeg, png）
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('只支持 JPG/PNG 格式图片'))
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 1024 * 1024} // 限制1MB以内
});

module.exports = upload
