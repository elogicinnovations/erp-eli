const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { IssuedReturn, Inventory, MasterList, Issuance} = require("../db/models/associations"); 


// Get All 
router.route('/getReturned').get(async (req, res) => 
{
    try {
        const data = await IssuedReturn.findAll({
            include: [{
                model: MasterList,
                 required: true
                },
                {
                    model: Inventory,
                    required: true
                },
                {
                    model: Issuance,
                    required: true
                }]
            });

        if (data) {
        return res.json(data);
        } else {
        res.status(400);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json("Error");
    }
});
 
module.exports = router;