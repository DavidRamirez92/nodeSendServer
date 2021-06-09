const multer = require('multer');
const shortid = require('shortid');
const fs = require ('fs');
const Links = require('../models/Links');





exports.uploadFile = async (req, res, next) => {

    const configMulter = {
        limits : {fileSize: req.user ? 1024*1024*10 : 1000000 },
        storage: fileStorage = multer.diskStorage({
            destination:(req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename:(req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
    
            }
            
        })
        
    }

    const upload = multer(configMulter).single('file');

    upload(req, res, async(error) => {
        console.log(req.file);

        if(!error) {
            res.json({file: req.file.filename});
        } else {
            console.log(error);
            return next();
        }
    });
    
};

exports.deleteFile = async(req,res) => {
    console.log(req.file);

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.file}`);
        console.log("file deleted");
    } catch (error) {
        console.log(error);
    }
}

//Download File
exports.download = async (req,res, next) => {
    //get the link
    const {file} = req.params;
    const link = await Links.findOne({name: file});

    console.log(link);

    const fileDownload = __dirname + '/../uploads/' + file;
    res.download(fileDownload);

    //Delete the file from DB
    //if the Downloads equals to 1 - delete the url and the file
    const {downloads, name} = link;

    if(downloads === 1) {

        //Delete file
        req.file = name;

        //delete entry in DB
        await Links.findOneAndRemove(link.id);
        next();
    } else {
        //if Downloads > 1 - subtract 1
        link.downloads --;
        await link.save();
    }
}