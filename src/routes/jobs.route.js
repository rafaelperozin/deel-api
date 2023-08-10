const jobs = require('../controllers/jobs.controller');
const router = require('express').Router();

router.get('/unpaid', jobs.getUnpaidJobs);

module.exports = router;
