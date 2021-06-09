const User = require('../models/Users');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

exports.newUser = async (req, res) => {
    
    //show the error messages from express validator
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }

    //Check if the User has been already created
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if(user) {
        return res.status(400).json({msg: "the user is already register"})
    }

    //Create new user
    user = new User( req.body );

    //hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt );

    try {
        await user.save();

        res.json({msg: "user created successfully"});
    } catch (error) {
        console.log(error);
    }

  
}