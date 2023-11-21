const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const SubPart_SparePart = require('../db/models/subPart_sparePart.model')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

router.route('/fetchTable').get(async (req, res) => {
    try {
    //   const data = await MasterList.findAll({
    //     include: {
    //       model: UserRole,
    //       required: false,
    //     },
    //   });
      const data = await SubPart_SparePart.findAll();
  
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
  
  router.route('/fetchTableEdit').get(async (req, res) => {
    try {
      const { id } = req.query;
  
      if (!id) {
        return res.status(400).json({ error: 'Missing required parameter: id' });
      }
  
      const data = await SubPart_SparePart.findAll({
        where: {
          sparePart_id: id,
        },
      });
  
      if (data) {
        return res.json(data);
      } else {
        res.status(404).json({ error: 'Data not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });  

module.exports = router;