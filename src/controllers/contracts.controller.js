/**
 * @returns contract by id
*/
const getContract = async (req, res) => {
  const { Contract } = req.app.get('models')
  const { id } = req.params
  const profile_id = req.headers['profile_id']

  const contract = await Contract.findOne({ where: { id, ClientId: profile_id } })
    
  if (!contract) return res.status(404).json({ message: 'The resource was not found.' }).end()
    
  res.json(contract)
}

module.exports = {
  getContract
}
