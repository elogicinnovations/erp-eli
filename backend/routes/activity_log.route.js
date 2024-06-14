const router = require('express').Router()
const {where, Op, fn, col} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {Activity_Log, MasterList, Department} = require('../db/models/associations')
const session = require('express-session')


router.route('/getlogged').get(async (req, res) => {
    try {
      const Notsuperadmin = await MasterList.findAll({
        where: {
          user_type: { [Op.ne]: 'Superadmin' },
        },
      });
  
      const userIdtype = Notsuperadmin.map((item) => item.col_id);
  
      const actlog = await Activity_Log.findAll({
        include: [{
          model: MasterList,
          required: true,

            include: [{
              model: Department,
              required: true
            }]
        }],
        attributes: [
          'masterlist_id',
          [sequelize.fn('MAX', sequelize.col('activity_log.createdAt')), 'maxCreatedAt'],
        ],
        where: {
          masterlist_id: userIdtype,
        },
        group: ['masterlist_id'],
        order: [['maxCreatedAt', 'DESC']],
      });
  
      res.status(200).json(actlog);
    } catch (err) {
      console.error(err);
      res.status(500).json('Error');
    }
  });

// activitylog.route.js file
router.route("/fetchdropdownData").get(async (req, res) => {
  try {
    const data = await Activity_Log.findAll({
      where: { 
        masterlist_id: req.query.masterlist_id 
      },
      order: [['createdAt', 'DESC']],
      include: [{
        model: MasterList,
        required: true,

          include: [{
            model: Department,
            required: true
          }]
      }],
    });

    if (data) {
      return res.json(data);
    } else {
      res.status(400).json({ error: "No data found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/fetchDataForExport").get(async (req, res) => {
  try {
    const data = await Activity_Log.findAll({
      where: {
        masterlist_id: { [Op.ne]: 1 },
      },
      include: [{
        model: MasterList,
        required: true,
        include: [{
          model: Department,
          required: true
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    if (data) {
      return res.json(data);
    } else {
      res.status(400).json({ error: "No data found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// router.route("/fetchdropdownData").get(async (req, res) => {
//   try {
//     const data = await Activity_Log.findAll({
//       where: { 
//         masterlist_id: req.query.masterlist_id 
//       },
//       order: [['createdAt', 'DESC']],
//     });

//     if (data) {
//       return res.json(data);
//     } else {
//       res.status(400);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json("Error");
//   }
// });

router.route("/fetchmasterlist").get(async (req, res) => {
  try {
    const data = await MasterList.findAll({
      where: {
        user_type: { [Op.ne]: "Superadmin" },
      },
    });
    // const data = await MasterList.findAll();

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