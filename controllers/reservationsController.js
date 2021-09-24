const query = require('../lib/query');
const path = require('path');
const {validation} = require('express-validator');
const moment = require('moment');

exports.validate = (method) => {
    switch (method) {
        case 'addGuest' : {
           return [
               body('name', 'Name cannot be empty').notEmpty(),
               body('check-in', 'Check in has to be specified').notEmpty(),
               body('useremail', 'Invalid email').exists().isEmail(),
               body('password').exists().notEmpty(),
               body('phone', 'Invalid phone number').notEmpty().isNumber().isLength({min:10}),
            ]
        }
    }
}