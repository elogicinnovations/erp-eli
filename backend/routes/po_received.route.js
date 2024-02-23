const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const {
  PO_Received,
  Receiving_Image,
  ProductTAGSupplier,
  Assembly_Supplier,
  SparePart_Supplier,
  Subpart_supplier,
  Product,
  Assembly,
  SparePart,
  SubPart,
  Supplier,
  PR_PO,
  PR_PO_asmbly,
  PR_PO_spare,
  PR_PO_subpart
} = require("../db/models/associations");
const session = require("express-session");

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/PO_products").get(async (req, res) => {
    try {
        const pr_id = req.query.pr_id;
        const po_num = req.query.po_number;
        // Fetch data from all four tables with the specified pr_id
        const prPoData = await PR_PO.findAll({
          include: [{
            model: ProductTAGSupplier,
            required: true,
  
              include: [{
                model: Product,
                required: true,
                attributes: [
                  ['product_code', 'code'],
                  ['product_name', 'name'],
                ],
              
              },
              {
                model: Supplier,
                required: true
              }] 
          }],
          where: { 
            pr_id: pr_id,
            po_id: po_num
         },
        });
    
        const prPoAsmblyData = await PR_PO_asmbly.findAll({
          include: [{
            model: Assembly_Supplier,
            required: true,
  
              include: [{
                model: Assembly,
                required: true,
                attributes: [
                  ['assembly_code', 'code'],
                  ['assembly_name', 'name'],
                ],
              },
              {
                model: Supplier,
                required: true
              }
            ] 
          }],
          where: { 
            pr_id: pr_id,
            po_id: po_num
         },
        });
    
        const prPoSpareData = await PR_PO_spare.findAll({
          include: [{
            model: SparePart_Supplier,
            required: true,
  
              include: [{
                model: SparePart,
                required: true,
                attributes: [
                  ['spareParts_code', 'code'],
                  ['spareParts_name', 'name'],
                ],
              },
              {
                model: Supplier,
                required: true
              }] 
          }],
          where: { 
            pr_id: pr_id,
            po_id: po_num
         },
        });
    
        const prPoSubpartData = await PR_PO_subpart.findAll({
          include: [{
            model: Subpart_supplier,
            required: true,
  
              include: [{
                model: SubPart,
                required: true,
                attributes: [
                  ['subPart_code', 'code'],
                  ['subPart_name', 'name'],
                ],
              },
              {
                model: Supplier,
                required: true
              }] 
          }],
          where: { 
            pr_id: pr_id,
            po_id: po_num
         },
        });
    
        // Consolidate data into an object with po_id as keys
        const consolidatedObject = {};
    
        prPoData.forEach(item => {
          const po_id = item.po_id;
          consolidatedObject[po_id] = consolidatedObject[po_id] || { title: `${po_id}`, items: [] };
          consolidatedObject[po_id].items.push({item, supp_tag: item.product_tag_supplier.product, suppliers: item.product_tag_supplier.supplier, type: 'Product'});
        });
    
        prPoAsmblyData.forEach(item => {
          const po_id = item.po_id;
          consolidatedObject[po_id] = consolidatedObject[po_id] || { title: `${po_id}`, items: []};
          consolidatedObject[po_id].items.push({item, supp_tag: item.assembly_supplier.assembly, suppliers: item.assembly_supplier.supplier, type: 'Product Assembly' });
        });
    
        prPoSpareData.forEach(item => {
          const po_id = item.po_id;
          consolidatedObject[po_id] = consolidatedObject[po_id] || { title: `${po_id}`, items: [] };
          consolidatedObject[po_id].items.push({item, supp_tag: item.sparepart_supplier.sparePart, suppliers: item.sparepart_supplier.supplier, type: 'Product Part' });
        });
    
        prPoSubpartData.forEach(item => {
          const po_id = item.po_id;
          consolidatedObject[po_id] = consolidatedObject[po_id] || { title: `${po_id}`, items: [] };
          consolidatedObject[po_id].items.push({item, supp_tag: item.subpart_supplier.subPart, suppliers: item.subpart_supplier.supplier, type: 'Product Subpart'});
        });
    
        // Convert the object values back to an array
        const consolidatedArray = Object.values(consolidatedObject);
    
        // Sort the consolidated array by po_id
        // consolidatedArray.forEach(group => {
        //   group.items.sort((a, b) => a.po_id.localeCompare(b.po_id));
        // });
    
        // console.log(consolidatedArray);

        const Image = await Receiving_Image.findAll({
          where: {
              pr_id: pr_id,
              po_num: po_num
          },
        });

        console.log(Image)
    
        res.status(200).json({
          consolidatedArray: consolidatedArray,
          image_receiving: Image
        });
      } catch (err) {
        console.error(err);
        res.status(500).json("Error");
      }
});

// //-------------------------------------------------//
// router.route('/fetchView').get(async (req, res) => {
//     try {
//             const newData = await PO_Received.findAll({
//                 include: [{
//                     model: PR_PO,
//                     required: true,
//                     include: [{
//                         model: ProductTAGSupplier,
//                         required: true,
//                         include: [{
//                             model: Product,
//                             required: true,
//                         }]
//                     }]
//                 }]
//         });

//         res.status(200).json(newData);
//     } catch (err)
//     {
//       console.error(err);
//       res.status(500).send('An error occurred');
//     }
// });

// //-------------------------------------------------//
// router.route('/create').post(async (req, res) => {
//     try {
//             const newData = await PO_Received.create({
//             pr_id: req.body.pr_id,
//             quantity: req.body.quantity,
//             quantity_received: req.body.quantity_received,
//             quality_assurance: req.body.quality_assurance
//         });

//         res.status(200).json(newData);

//     } catch (err)
//     {
//       console.error(err);
//       res.status(500).send('An error occurred');
//     }
// });

module.exports = router;
