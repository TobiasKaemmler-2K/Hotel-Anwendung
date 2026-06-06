const express = require('express');
const roomController = require('../controllers/roomController');
const { requireAdminApiKey } = require('../middleware/security');
const { requirePositiveIntParam } = require('../middleware/validation');

const router = express.Router();

router.get('/', roomController.getRooms);
router.get('/:id', requirePositiveIntParam('id'), roomController.getRoomById);
router.post('/', requireAdminApiKey, roomController.createRoom);
router.put('/:id', requireAdminApiKey, requirePositiveIntParam('id'), roomController.updateRoom);
router.delete('/:id', requireAdminApiKey, requirePositiveIntParam('id'), roomController.deleteRoom);

module.exports = router;
