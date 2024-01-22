const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {SubPart, Subpart_Price_History, Supplier} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


router.route('/fetchsubpricehistory').get(async (req, res) => {
    try {
      const data = await Subpart_Price_History.findAll({
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

module.exports = router;    