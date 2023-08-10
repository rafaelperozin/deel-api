// I could create a jobs folder and create one controller for each method but it's tool complex for a simple API.
// I like to add complexity when the API become a larger with more complex methods.

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

/**
 * @returns client can pay for a job and deduct from they balance
 * 
 * Obs.: Usually I don't keep comments in the middle of the code
 * because if you name correctly the variables and organise well your code
 * it's self-explanatory. But on this case, a code test, it's important to show the logic/process.
*/
const payJob = async (req, res) => {
  const { Profile, Job, Contract } = req.app.get('models');
  const profile_id = req.headers['profile_id'];
  const { job_id } = req.params;

  // 1. Check the owner of the job, it must be the profile loggedin (coming from headers)
  const job = await Job.findOne({
    where: { id: job_id },
    include: [
      {
        model: Contract,
        attribute: ['ContractId']
      },
    ],
  });
  const profileIsNotAuthorised = job.Contract.ClientId !== Number(profile_id);

  if (profileIsNotAuthorised) return res.status(401).json({ message: 'Sorry, you have no authorisation.' }).end();
  
  // 2. Profile: check profile balance
  const client = await Profile.findOne({ where: { id: profile_id, type: 'client' }});
  const { price } = await Job.findOne({ where: { id: job_id }});
  const clientHasNoCredit = client.balance < price;

  if (clientHasNoCredit) return res.status(424).json({ message: 'Failed Dependency: You have no balance to pay for this job.' }).end();

  // 3. Job: Check if job is already paid
  const { paid } = await Job.findOne({ where: { id: job_id } });

  if (paid) return res.status(400).json({ message: 'You already paid for this job.' }).end();
  
  // 4. Job: register a payment
  job.update({ paid: true, paymentDate: new Date() });
  const jobUpdated = await Job.findOne({
    where: { id: job_id }
  })

  // 5. Profile: deduct payment from balance
  const newBalance = client.balance - price
  client.update({ balance: newBalance });
  
  // We should add a currency to the value.
  res.status(200).json({ message: `Job paid. Your new balance is ${newBalance}.` })
}

module.exports = {
  getUnpaidJobs,
  payJob
}
