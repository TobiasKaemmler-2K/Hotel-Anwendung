const express = require('express');
const reservationController = require('../controllers/reservationController');
const { requireAdminApiKey } = require('../middleware/security');
const { requirePositiveIntParam } = require('../middleware/validation');

const router = express.Router();

router.get('/', requireAdminApiKey, reservationController.getReservations);
router.get('/:id', requireAdminApiKey, requirePositiveIntParam('id'), reservationController.getReservationById);
router.post('/', reservationController.createReservation);
router.put('/:id', requirePositiveIntParam('id'), reservationController.updateReservation);
router.delete('/:id', requirePositiveIntParam('id'), reservationController.cancelReservation);

module.exports = router;
