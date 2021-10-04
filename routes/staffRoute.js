const express = require('express');
const router = express.Router();

const staffController = require('../../controllers/manager/staffController');

router.post('/staff/',staffController.addStaff);
router.delete('/staff/:id',staffController.deleteStaff);
router.put('/staff/',staffController.updateStaff);
router.get('/staff/:id',staffController.getStaff);
router.get('/staff/',staffController.listStaff);

module.exports = router;