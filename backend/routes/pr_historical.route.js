const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {PR, PR_history} = require('../db/models/associations')
const session = require('express-session');
const { route } = require('./masterlist.route');

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


// Update the fetchPRhistory endpoint to fetch only unread notifications
// router.route('/fetchPRhistory').get(async (req, res) => {
//   try {
//     const data = await PR_history.findAll({
//       where: {
//         isRead: false, // Fetch only unread notifications
//       },
//       attributes: ['pr_id', [sequelize.fn('max', sequelize.col('createdAt')), 'latestCreatedAt']],
//       group: ['pr_id'],
//       raw: true,
//     });

//     const prIds = data.map(entry => entry.pr_id);

//     const latestData = await PR_history.findAll({
//       where: {
//         pr_id: {
//           [Op.in]: prIds,
//         },
//         createdAt: {
//           [Op.in]: data.map(entry => entry.latestCreatedAt),
//         },
//       },
//     });

//     if (latestData) {
//       return res.json(latestData);
//     } else {
//       res.status(400);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json("Error");
//   }
// });
router.route('/fetchPRhistory').get(async (req, res) => {
  try {
    const data = await PR_history.findAll({
      attributes: ['pr_id', [sequelize.fn('max', sequelize.col('createdAt')), 'latestCreatedAt']],
      group: ['pr_id'],
      raw: true,
    });

    const prIds = data.map(entry => entry.pr_id);

    const latestData = await PR_history.findAll({
      where: {
        pr_id: {
          [Op.in]: prIds,
        },
        createdAt: {
          [Op.in]: data.map(entry => entry.latestCreatedAt),
        },
      },
    });

    if (latestData) {
      return res.json(latestData);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});


  router.route('/fetchSpecificPR').get(async (req, res) => {
    try {
     
      const data = await PR.findAll({
          where: {
            id: req.query.id
          },
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

  
  router.route('/markAsRead/:pr_id').put(async (req, res) => {
    try {
      const { pr_id } = req.params;
      
      // Update the isRead column for the specific pr_id
      await PR_history.update({ isRead: true }, { where: { pr_id } });
  
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });


  // router.route('/fetchdropdownData').get(async (req, res) => {
  //   try {
  //     const data = await PR_history.findAll({
  //       where: {
  //         pr_id: req.body.id,
  //       },
  //       include: {
  //         model : PR,
  //         required: true
  //       }
  //     });
  
  //     if (!data) {
  //       return res.status(404).json();
  //     }
      
  //     return res.json(data);
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: "An error occurred" });
  //   }
  // });


  router.route("/fetchdropdownData").get(async (req, res) => {
    try {
      const data = await PR_history.findAll({
        include: [
          {
            model: PR,
            required: true,
          },
        ],
        where: { pr_id: req.query.id },
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