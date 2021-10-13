const express = require('express');
const router = express.Router();

const staffController = require('../controllers/staffController');

router.post('/staff/',staffController.validate('addStaff'),staffController.addStaff);
router.delete('/staff/:id',staffController.validate('deleteStaff'),staffController.deleteStaff);
router.put('/staff/',staffController.validate('updateStaff'),staffController.updateStaff);
router.get('/staff/:id',staffController.validate('getStaff'),staffController.getStaff);
router.get('/staff/',staffController.listStaff);

module.exports = router;