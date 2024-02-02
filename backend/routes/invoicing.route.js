const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {PR_PO, PR_PO_asmbly, PR_PO_spare, PR_PO_subpart, PR, PR_history} = require('../db/models/associations')
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

  
router.route('/save').post(async (req, res) => {
  try {
    const arrayPO = req.body.arrayPO
    const PR_id = req.body.pr_id
    for (const parent of arrayPO) {
      const po_number = parent.title

      for (const child of parent.serializedArray) {
        const quantity = child.quantity
        const type = child.type
        const prod_supp_id = child.prod_supplier

        // console.log(`quantity${quantity} type ${type}`)
        

            if (type === 'product') {
              PR_PO.create({
                  pr_id: PR_id,
                  po_id: po_number,
                  quantity: quantity,
                  product_tag_supplier_ID: prod_supp_id
              });           
          } else if(type === 'assembly'){
              PR_PO_asmbly.create({
                pr_id: PR_id,
                po_id: po_number,
                quantity: quantity,
                assembly_suppliers_ID: prod_supp_id
              });           
          } else if(type === 'spare'){
              PR_PO_spare.create({
                pr_id: PR_id,
                po_id: po_number,
                quantity: quantity,
                spare_suppliers_ID: prod_supp_id
              });           
          } else if(type === 'subpart'){
              PR_PO_subpart.create({
                pr_id: PR_id,
                po_id: po_number,
                quantity: quantity,
                subpart_suppliers_ID: prod_supp_id
              });           
          }
      }    
    }

    const PR_update = PR.update({
      status: 'For-Approval (PO)'
    },
    {
      where: { id: PR_id }
    }); 

    if (PR_update){
      const PR_historical = PR_history.create({
        pr_id: PR_id,
        status: 'For-Approval (PO)'
      });


      if(PR_historical){
        return res.status(200).json()
      }    
    }

  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
  });

  router.route('/fetchPOarray').get(async (req, res) => {
    try {
      const pr_id = req.query.id;
  
      // Fetch data from all four tables with the specified pr_id
      const prPoData = await PR_PO.findAll({
        where: { pr_id: pr_id },
      });
  
      const prPoAsmblyData = await PR_PO_asmbly.findAll({
        where: { pr_id: pr_id },
      });
  
      const prPoSpareData = await PR_PO_spare.findAll({
        where: { pr_id: pr_id },
      });
  
      const prPoSubpartData = await PR_PO_subpart.findAll({
        where: { pr_id: pr_id },
      });
  
      // Consolidate data into an object with po_id as keys
      const consolidatedObject = {};
  
      prPoData.forEach(item => {
        const po_id = item.po_id;
        consolidatedObject[po_id] = consolidatedObject[po_id] || { title: `${po_id}`, items: [] };
        consolidatedObject[po_id].items.push(item);
      });
  
      prPoAsmblyData.forEach(item => {
        const po_id = item.po_id;
        consolidatedObject[po_id] = consolidatedObject[po_id] || { title: `${po_id}`, items: [] };
        consolidatedObject[po_id].items.push(item);
      });
  
      prPoSpareData.forEach(item => {
        const po_id = item.po_id;
        consolidatedObject[po_id] = consolidatedObject[po_id] || { title: `${po_id}`, items: [] };
        consolidatedObject[po_id].items.push(item);
      });
  
      prPoSubpartData.forEach(item => {
        const po_id = item.po_id;
        consolidatedObject[po_id] = consolidatedObject[po_id] || { title: `${po_id}`, items: [] };
        consolidatedObject[po_id].items.push(item);
      });
  
      // Convert the object values back to an array
      const consolidatedArray = Object.values(consolidatedObject);
  
      // Sort the consolidated array by po_id
      consolidatedArray.forEach(group => {
        group.items.sort((a, b) => a.po_id.localeCompare(b.po_id));
      });
  
      // console.log(consolidatedArray);
  
      res.status(200).json(consolidatedArray);
    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });
  
  


module.exports = router;