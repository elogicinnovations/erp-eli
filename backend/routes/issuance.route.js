const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { Issuance, MasterList, CostCenter } = require("../db/models/associations"); 


// Get All Issuance
router.route('/getIssuance').get(async (req, res) => 
{
    try {
        const data = await Issuance.findAll({
            include: [{
                model: MasterList,
                 required: true
                },
            {
                model: CostCenter,
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



//Create Issuance
router.route('/create').post(async (req, res) => {

try {
    const newData = await Issuance.create({
        from_site: req.body.fromSite,
        issued_to: req.body.issuedTo,
        with_accountability: req.body.withAccountability,
        accountability_refcode: req.body.accountabilityRefcode,
        serial_number: req.body.serialNumber,
        job_order_refcode: req.body.jobOrderRefcode,
        received_by: req.body.receivedBy,
        transported_by: req.body.transportedBy,
        mrs: req.body.mrs,
        remarks: req.body.remarks
    });

    res.status(200).json(newData);
    } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
};
});
 
module.exports = router;