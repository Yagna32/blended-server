const multer = require('multer')
const path = require('path')

// Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${file.originalname.split('.')[0]}_${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload = multer({storage:storage})

module.exports = upload