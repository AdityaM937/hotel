const express = require('express');
const router = express.Router();

const guestController = require('../controllers/guestController');

router.post('/guest/',guestController.addGuest);
router.delete('/guest/:id',guestController.deleteGuest);
router.put('/guest/',guestController.updateGuest);
router.get('/guest/:id',guestController.getGuest);
router.get('/guest/',guestController.listGuest);
module.exports =router