const express = require('express');
const router = express.Router();

const guestController = require('../controllers/guestController');
router.get('/guest/',guestController.listGuest);
router.post('/guest/',guestController.validate('addGuest'),guestController.addGuest);
router.delete('/guest/:id',guestController.validate('deleteGuest'),guestController.deleteGuest);
router.put('/guest/',guestController.validate('updateGuest'),guestController.updateGuest);
router.get('/guest/:id',guestController.validate('searchGuest'),guestController.getGuest);

module.exports =router