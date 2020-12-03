import multer from 'multer';
import path from 'path';

//multer config
const multerFileUpload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let _ext = path.extname(file.originalname);
        const ext = [".pdf"];
        if(!ext.includes(_ext)){
            cb(new Error("File format not supported"), false);
            return;
        }
        cb(null, true);
    },
    limits: {fileSize: 5 * 1024 * 1024}
});

const multerImageUpload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let _ext = path.extname(file.originalname);
        const ext = [".jpg", ".jpeg", ".png"];
        if(!ext.includes(_ext)){
            cb(new Error("File format not supported"), false);
            return;
        }
        cb(null, true);
    },
    limits: {fileSize: 5 * 1024 * 1024}
});

export {
    multerFileUpload,
    multerImageUpload
}