const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id',getProfile ,async (req, res) =>{
    const {Contract} = req.app.get('models')
    const { id } = req.params
    const profile_id = req.headers['profile_id']
    const contract = await Contract.findOne({where: {id, ClientId: profile_id}})
    if (!contract) return res.status(404).json({ message: 'The resource was not found.'}).end()
    res.json(contract)
})
module.exports = app;
