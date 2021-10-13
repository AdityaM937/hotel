const express = require('express');
const router = express.Router();

const roomController = require('../controllers/roomController');

router.post('/room/',roomController.validate('addRoom'),roomController.addRoom);
router.delete('/room/:roomid',roomController.validate('deleteRoom'),roomController.deleteRoom);
//router.put('/room/',roomController.validate(''),roomController.updateStaff);
router.get('/room/:roomid',roomController.validate('getRoom'),roomController.getRoom);
router.get('/room/',roomController.listRoom);

module.exports = router;