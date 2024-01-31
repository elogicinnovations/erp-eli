const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { ProductTAGSupplier, Assembly_Supplier, SparePart_Supplier, 
        Subpart_supplier, productTAGsupplierHistory, AssemblyPrice_History,
        SparePartPrice_history, Subpart_Price_History
      } = require('../db/models/associations')
const session = require('express-session')

router.route('/updatePrice').post(async (req, res) => {
    try {

        const { productSupplier_id, updatedPriced, supp_code, product_ID} = req.body;

        // console.log("supplier_code "+supp_code)
        // console.log("prodID "+product_ID)
        const PR_update = await ProductTAGSupplier.update({
            product_price: updatedPriced
          },
          {
            where: { id: productSupplier_id}
          })

          if(PR_update){        
            // console.log("dasdsaddddddddddddddddddddddddddddddddddd")   
            const ExistingSupplier =  await productTAGsupplierHistory.findOne({
              where: {
                product_id: product_ID,
                supplier_code: supp_code,
              },
              order: [['createdAt', 'DESC']],
            });

            if (ExistingSupplier) {
              const existPrice = ExistingSupplier.product_price;
              // console.log("Supplier Price:" + existPrice);
              // console.log("new Price:" + updatedPriced);
              if (existPrice != updatedPriced) {
                await productTAGsupplierHistory.create({
                  product_id: product_ID,
                  supplier_code: supp_code,
                  product_price: updatedPriced,
                });
              }
            };

            res.status(200).json()
          }
    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });


  
router.route('/updatePrice_asm').post(async (req, res) => {
    try {

      const { productSupplier_id, updatedPriced, supp_code, product_ID} = req.body;


        // console.log(req.body.updatedPriced)
        // console.log(req.body.productSupplier_id)
        const PR_update = Assembly_Supplier.update({
            supplier_price: updatedPriced
          },
          {
            where: { id: productSupplier_id }
          })

          if(PR_update){



            const ExistingSupplier =  await AssemblyPrice_History.findOne({
              where: {
                assembly_id: product_ID,
                supplier_code: supp_code,
              },
              order: [['createdAt', 'DESC']],
            });

            if (ExistingSupplier) {
              const existPrice = ExistingSupplier.supplier_price;
              // console.log("Supplier Price:" + existPrice);
              // console.log("new Price:" + updatedPriced);
              if (existPrice != updatedPriced) {
                await AssemblyPrice_History.create({
                  assembly_id: product_ID,
                  supplier_code: supp_code,
                  supplier_price: updatedPriced,
                });
              }
            };


            res.status(200).json()
          }
    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });


  router.route('/updatePrice_spare').post(async (req, res) => {
    try {

      const { productSupplier_id, updatedPriced, supp_code, product_ID} = req.body;


        // console.log(req.body.updatedPriced)
        // console.log(req.body.productSupplier_id)
        const PR_update = SparePart_Supplier.update({
            supplier_price: updatedPriced
          },
          {
            where: { id: productSupplier_id }
          })

          if(PR_update){


            const ExistingSupplier =  await SparePartPrice_history.findOne({
              where: {
                sparePart_id: product_ID,
                supplier_code: supp_code,
              },
              order: [['createdAt', 'DESC']],
            });

            if (ExistingSupplier) {
              const existPrice = ExistingSupplier.supplier_price;
              // console.log("Supplier Price:" + existPrice);
              // console.log("new Price:" + updatedPriced);
              if (existPrice != updatedPriced) {
                await SparePartPrice_history.create({
                  sparePart_id: product_ID,
                  supplier_code: supp_code,
                  supplier_price: updatedPriced,
                });
              }
            };


            res.status(200).json()
          }
    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });

  router.route('/updatePrice_subpart').post(async (req, res) => {
    try {
        // console.log(req.body.updatedPriced)
        // console.log(req.body.productSupplier_id)
        const { productSupplier_id, updatedPriced, supp_code, product_ID} = req.body;
        
        const PR_update = Subpart_supplier.update({
            supplier_price: updatedPriced
          },
          {
            where: { id: productSupplier_id }
          })

          if(PR_update){

            const ExistingSupplier =  await Subpart_Price_History.findOne({
              where: {
                subpart_id: product_ID,
                supplier_code: supp_code,
              },
              order: [['createdAt', 'DESC']],
            });

            if (ExistingSupplier) {
              const existPrice = ExistingSupplier.supplier_price;
              // console.log("Supplier Price:" + existPrice);
              // console.log("new Price:" + updatedPriced);
              if (existPrice != updatedPriced) {
                await Subpart_Price_History.create({
                  subpart_id: product_ID,
                  supplier_code: supp_code,
                  supplier_price: updatedPriced,
                });
              }
            };


            res.status(200).json()
          }
    } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
  });
module.exports = router;