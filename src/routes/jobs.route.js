const jobs = require('../controllers/jobs.controller');
const router = require('express').Router();

router.get('/unpaid', jobs.getUnpaidJobs);
// This route I would invert the order to be /jobs/pay/:job_id
router.post('/:job_id/pay', jobs.payJob);

module.exports = router;
