const bookingController = require('../controllers/bookingController');
const express = require('express');
const router = express.Router();

router.post('/book-room',bookingController.validate('bookRoom'),bookingController.bookRoom);
router.post('/get-room',bookingController.validate('getFreeRoom'),bookingController.getFreeRoom);

module.exports = router;