const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const Manufacturer = require('../db/models/manufacturer.model');

router.route('/add').post(async (req, res) => {
    const { codeManu, nameManufacturer, descriptManufacturer } = req.body

    await Manufacturer.create({
        manufacturer_code : codeManu,
        manufacturer_name : nameManufacturer,
        manufacturer_remarks : descriptManufacturer
    }).then((manufacturerResponse) => {
        return res.status(200).json({ sucess: true, manufacturerResponse});
    }).catch((err) => {
        return res.status(500).json({ success: false, error : "Error"})
    })
});


router.route('/retrieve').get(async (req, res) => {
    try {
      const data = await Manufacturer.findAll();
  
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