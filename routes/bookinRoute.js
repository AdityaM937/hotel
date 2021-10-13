const bookingController = require('../controllers/bookingController');
const express = require('express');
const router = express.Router();

router.post('/book-room',bookingController.bookRoom);
router.post('/get-room',bookingController.getFreeRoom);