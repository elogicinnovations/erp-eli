const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const Settings = require('../db/models/settings.model');
const session = require('express-session');

router.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));


router.route('/create').post(async (req, res) => {
  try {
      const newData = await Settings.create({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        steet: req.body.steet,
        barangay: req.body.barangay,
        city: req.body.city,
        zipcode: req.body.zipcode
      });

      res.status(200).json(newData);
    } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

router.route('/fetchdata').get(async (req, res) => {
  try {
   
    const data = await Settings.findOne({
        where: {
          id: req.query.id
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