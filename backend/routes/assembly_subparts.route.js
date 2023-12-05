const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {Assembly_SubPart, Assembly, Assembly_SparePart, SubPart} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

router.route('/fetchinTable').get(async (req, res) => {
      try {
          const data = await Assembly_SubPart.findAll({
            include:[{
               model: SubPart,
               required: true 
            }],
            where: {
                assembly_id: req.query.id,
            },
          });
  
          if (!data) {
          return res.status(404).json();
          
          }
          // console.log(data)
          return res.json(data);
          
      } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'An error occurred' });
      }
  });


module.exports = router;