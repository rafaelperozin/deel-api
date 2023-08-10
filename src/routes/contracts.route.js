const contracts = require('../controllers/contracts.controller');
const router = require('express').Router();

router.get('/:id', contracts.getContract);
router.get('/', contracts.allContracts);

module.exports = router;
