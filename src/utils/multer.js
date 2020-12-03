import multer from 'multer';
import path from 'path';

//multer config
export default multer({
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