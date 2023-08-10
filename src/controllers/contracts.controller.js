// I could create a contracts folder and create one controller for each method but it's tool complex for a simple API.
// I like to add complexity when the API become a larger with more complex methods.

const { Op } = require("sequelize");

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

/**
 * @returns list non terminated contracts
*/
const allContracts = async (req, res) => {
  const { Contract } = req.app.get('models')
  const profile_id = req.headers['profile_id']

  // It was not requested, but if we start thinking about pagination, we could use the findAndCountAll().
  // If you start thinking about filters, the status could be an optional query and not terminated would be the default value.
  const contract = await Contract.findAll({
    where: {
      ClientId: profile_id,
      status: {
        [Op.ne]: 'terminated'
      }
    }
  })
    
  if (contract.lenght === 0) return res.status(404).json({ message: 'The resource was not found.' }).end()
    
  res.json(contract)
}

module.exports = {
  getContract,
  allContracts
}
