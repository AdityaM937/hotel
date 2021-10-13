const express = require('express');
const router = express.Router();

const guestController = require('../controllers/guestController');

router.post('/guest/',guestController.validate('addGuest'),guestController.addGuest);
router.delete('/guest/:id',guestController.validate('deleteGuest'),guestController.deleteGuest);
router.put('/guest/',guestController.validate('updateGuest'),guestController.updateGuest);
router.get('/guest/:id',guestController.validate('getGuest'),guestController.getGuest);
router.get('/guest/',guestController.listGuest);
module.exports =router