const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});
const {validationResult} = require('express-validator');

exports.authenticateUser = async (req,res,next) => {

    //checking for errors
     const errors = validationResult(req);
     if(!errors.isEmpty()) {
         return res.status(400).json({errors:errors.array()});
     }

    //checking the user is register
    const { email, password } = req.body;
    const user = await User.findOne({email});
    //console.log(user);

    if(!user) {
        res.status(401).json({msg: "Username doesn't exist"});
        return next();
    }

    //Verify the Password and authenticate user
    if(bcrypt.compareSync(password, user.password )) {

        //Create JWT
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
        }, process.env.SECRET,{
            expiresIn: '8h'
        } );

       res.json({token});

    } else {
       res.status(401).json({msg: "Password Incorrect"});
       return next();
    }
}

exports.userAuthenticated = (req, res, next) => {
    res.json( {user: req.user} );
}