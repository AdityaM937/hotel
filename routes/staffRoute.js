const express = require('express');
const router = express.Router();

const staffController = require('../controllers/staffController');
router.get('/staff/',staffController.listStaff);
router.post('/staff/',staffController.validate('addStaff'),staffController.addStaff);
router.delete('/staff/:id',staffController.validate('deleteStaff'),staffController.deleteStaff);
router.put('/staff/',staffController.validate('updateStaff'),staffController.updateStaff);
router.get('/staff/:id',staffController.validate('getStaff'),staffController.getStaff);


module.exports = router;