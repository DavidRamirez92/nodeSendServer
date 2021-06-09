const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const filesController = require('../controllers/filesController');
const { check } = require ('express-validator');
const auth = require('../middleware/auth');

router.post('/',
    [
        check('name','Download a file').not().isEmpty(),
        check('original_name','Download a file').not().isEmpty(),
    ],
    auth,   
    linkController.newLink
);

router.get('/',
    linkController.allLinks
    );

router.get('/:url',
    linkController.hasPassword,
    linkController.getLink
);

router.post('/:url',
    linkController.checkPassword,
    linkController.getLink
);

module.exports = router;