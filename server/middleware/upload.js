const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // ตรวจสอบชื่อ field และตั้งค่าปลายทาง
        if (file.fieldname === 'avatarphoto') {
            cb(null, './uploads/avatar');
        } else if (file.fieldname === 'idcardphoto') {
            cb(null, './uploads/idcard');
        } else if (file.fieldname === 'companyphoto') {
            cb(null, './uploads/company');
        } else {
            cb(new Error('Invalid field name'));
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, '' + uniqueSuffix + file.originalname);
    }
});

exports.upload = multer({ storage: storage }).fields([
    { name: 'avatarphoto' },
    { name: 'idcardphoto' },
    { name: 'companyphoto' }
]);