const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {SubPart, Subpart_supplier, Supplier} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

router.route('/fetchCanvass').get(async (req, res) => {
  try {
    console.log(req.query.id)
    const data = await Subpart_supplier.findAll({
      include: [
        {
          model: SubPart,
          required: true,
        },

        {
          model: Supplier,
          required: true,
        },
      ],
      where: { subpart_id: req.query.id },
      // where: { subpart_id: req.query['sub_id'] },
    });

    if (data) {
      // console.log(data);
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
  });

  router.route('/fetchSubSupplier').get(async (req, res) => {
    try {
      const data = await Subpart_supplier.findAll({
        include:[{
          model: Supplier,
          required: true
        }],
        where: {subpart_id: req.query.id}
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