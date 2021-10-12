const express = require('express');
const router = express.Router();

const roomController = require('../controllers/roomController');

router.post('/room/',roomController.addRoom);
router.delete('/room/:roomid',roomController.deleteRoom);
// router.put('/room/',roomController.updateStaff);
router.get('/room/:roomid',roomController.getRoom);
router.get('/room/',roomController.listRoom);

module.exports = router;