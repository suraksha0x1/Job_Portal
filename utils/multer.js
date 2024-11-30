const multer = require("multer");
const path = require("path")


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './public/uploads');
    
    },
    filename: function(req,file,cb){
        cb(null,file.filedname + '-' + Date.now()+path.extname(file.originalname));
    }
});
// Initialize upload variable
const upload =multer({
    storage:storage,
    limits: {fileSize: 2* 1024 * 1024},
    fileFilter:function(req,file,cb){
        checkFileType(file,cb);
    }
});
// check file type

function checkFileType(file,cb){
    const filetypes = /pdf/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname){
        return cb(null, true);
    }else{
        cb('Error: PDFs only');
    }
}

module.exports = upload;