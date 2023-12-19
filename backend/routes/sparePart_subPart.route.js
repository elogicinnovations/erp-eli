const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {SparePart_SubPart, SubPart} = require('../db/models/associations')
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


  router.route('/fetchsubpartTable').get(async (req, res) => {
    try {
        const data = await SparePart_SubPart.findAll({
          include:[{
              model: SubPart,
              required: true 
          }],
          where: {
            sparePart_id: req.query.id,
          },
        });

        if (!data) {
        return res.status(404).json();
        
        }
        console.log(data)
        return res.json(data);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});


router.route('/fetchsubpartTable').get(async (req, res) => {
  try {
      const data = await SparePart_SubPart.findAll({
        include:[{
           model: SubPart,
           required: true 
        }],
        where: {
            id: req.query.id,
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