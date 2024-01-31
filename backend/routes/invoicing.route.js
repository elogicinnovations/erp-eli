const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {PR_PO, PR_PO_asmbly, PR_PO_spare, PR_PO_subpart} = require('../db/models/associations')
const session = require('express-session')




router.route('/lastPONumber').get(async (req, res) => {
  try {
    const latestPR = await PR_PO.findOne({
      attributes: [[sequelize.fn('max', sequelize.col('po_id')), 'latestNumber']],
    });
    let latestNumber = latestPR.getDataValue('latestNumber');

    // console.log('Latest Number:', latestNumber);

    // Increment the latestNumber by 1 for a new entry
    latestNumber = latestNumber !== null ? (parseInt(latestNumber, 10)).toString() : '0';
    // console.log('string Number:', latestNumber.padStart(8, '0'));

    // Do not create a new entry, just return the incremented value
    return res.json(latestNumber.padStart(8, '0'));
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
  });


// router.route('/lastPONumber').get(async (req, res) => {
//   try {
//     const latestPoId = await findLatestPoId();
//     console.log('--------------------------------------------')
//     console.log('test', latestPoId)

//     res.json({ latestPoId });
//   } catch (error) {
//     console.error('Error fetching latest PoId:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
//   });


  
// async function findLatestPoId() {
//   try {
//     const latestPoIds = await Promise.all([
//       findLatestPoIdForTable(PR_PO),
//       findLatestPoIdForTable(PR_PO_asmbly),
//       findLatestPoIdForTable(PR_PO_spare),
//       findLatestPoIdForTable(PR_PO_subpart),
//     ]);

//     const maxPoId = Math.max(...latestPoIds);

//     // If no data in any of the tables, set the initial value to '00000001'
//     const initialPoId = latestPoIds.length === 0 ? '00000001' : maxPoId;

//     return initialPoId;
//   } catch (error) {
//     throw error;
//   }
// }

// async function findLatestPoIdForTable(model) {
//   try {
//     const latestPo = await model.findOne({
//       attributes: ['po_id'],
//       order: [['id', 'DESC']],
//     });

//     let latestCount = 1;

//     if (latestPo) {
//       latestCount = parseInt(latestPo.po_id.substring(8)) + 1;
//     }

//     return latestCount;
//   } catch (error) {
//     throw error;
//   }
// }

module.exports = router;