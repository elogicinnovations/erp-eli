const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { Issuance, MasterList, CostCenter } = require("../db/models/associations"); 


// Get All Issuance
router.route('/getIssuance').get(async (req, res) => 
{
    try {
        const data = await Issuance.findAll({
            include: {
                model: MasterList,
                 required: true
                },
            include: {
                model: CostCenter,
                required: true
            }
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