import multer from 'multer'

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024,
        files: 1,
        fields: 2,
        fieldSize: 100 * 1024
    },
    fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
            return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname))
        }

        callback(null, true)
    }
})


export default upload