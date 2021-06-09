const Links = require ('../models/Links');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

exports.newLink = async (req, res, next) => {
    //Check errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }
    //Create a Link Object
    const { original_name, name } = req.body;

    const link = new Links();
    link.url = shortid.generate();
    link.name = name;
    link.original_name = original_name;
    

    //If the user is authenticated
    
    if(req.user) {
        const { password, downloads } = req.body;

        //asign to link the number of downloads
        if(downloads) {
            link.downloads = downloads;
        }

        //asign a password
        if(password) {
            const salt = await bcrypt.genSalt(10);


            link.password = await bcrypt.hash(password, salt );
        }

        //Asing author
        link.author = req.user.id;

    }

    //Save in DB
    try {
        await link.save();
        return res.json({msg: `${link.url}`});
        next();
    } catch (error) {
        console.log(error);
    }

}

//Get all Links
exports.allLinks = async(req, res) => {
    try {
        const links = await Links.find({}).select('url -_id');
        res.json({links});
    } catch (error) {
        console.log(error);       
    }
}

exports.hasPassword = async (req,res,next) => {
    const { url } = req.params;

    //Verify if link exists
    const link = await Links.findOne({ url });

    if(!link) {
        res.status(404).json({msg: "The link doesn't exists"});
        return next();
    }

    if(link.password) {
        return res.json({password:true, link:link.url});
    }
    next();
}

exports.checkPassword = async(req,res,next) => {
    const {url} = req.params;
    const{password} = req.body;

    const link = await Links.findOne({url});

    if(bcrypt.compareSync(password, link.password)) {
        next();
    } else {
        return res.status(401).json({msg:'Wrong Password'})
    }
}

 

//Get Link
exports.getLink = async (req, res, next) => {

    const { url } = req.params;

    //Verify if link exists
    const link = await Links.findOne({ url });

    if(!link) {
        res.status(404).json({msg: "The link doesn't exists"});
        return next();
    }
    //If link exists
    res.json({file: link.name, password: false})

    next(); 
};

