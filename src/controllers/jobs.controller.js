/**
 * @returns unpaid jobs
*/
const getUnpaidJobs = async (req, res) => {
  const { Job, Contract } = req.app.get('models');
  const profile_id = req.headers['profile_id']

  const jobs = await Job.findAll({
    where: {
      paymentDate: null
    },
    include: [
      {
        model: Contract,
        where: {
          ClientId: profile_id,
          status: 'in_progress'
        }
      },
    ],
  })
    
  if (jobs.lenght === 0) return res.status(404).json({ message: 'The resource was not found.' }).end()
    
  res.json(jobs)
}

module.exports = {
  getUnpaidJobs
}
