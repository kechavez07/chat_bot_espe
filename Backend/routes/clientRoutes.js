const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');

router.post('/', clientsController.registerClient);
router.get('/', clientsController.getAllClients);
router.put('/:id', clientsController.updateClient);
router.delete('/:id', clientsController.deleteClient);

module.exports = router;
