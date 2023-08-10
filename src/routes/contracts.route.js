const contracts = require('../controllers/contracts.controller');
const router = require('express').Router();

router.get('/:id', contracts.getContract);

module.exports = router;
