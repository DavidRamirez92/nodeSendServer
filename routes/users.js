const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { check } = require ('express-validator');

router.post('/',
[
    check('name','The name is required').not().isEmpty(),
    check('email','Add a valid email').isEmail(),
    check('password','The password need have contain at least 6 characters').isLength({min:6}),
],  
    usersController.newUser
);

module.exports = router;