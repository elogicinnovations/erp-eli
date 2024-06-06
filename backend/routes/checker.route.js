const router = require('express').Router()
const {where, Op, fn, col} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {ProductTAGSupplier, Product, Supplier} = require('../db/models/associations')
const session = require('express-session')


router.route('/checkProduct').get(async (req, res) => {
    try {
        const { selectedValues } = req.query;
        const productIds = Array.isArray(selectedValues) ? selectedValues.map(Number) : [Number(selectedValues)];
        
        const check = await ProductTAGSupplier.findAll({
          include: [{
            model: Supplier,
            required: true,
            attributes: ['supplier_name'] // Select only the supplier_name column
          }, {
            model: Product,
            required: true,
            attributes: ['product_name'] // Select only the product_name column
          }],
          where: {
            product_id: productIds,
            status: 'Active'
          }
        });
        
        // Create a map of supplier names to their respective products and prices
        const supplierProductMap = {};
        check.forEach(record => {
          const productName = record.product.product_name;
          const supplierName = record.supplier.supplier_name;
          const productPrice = record.product_price || 0; // Set productPrice to 0 if undefined or null
          
          if (!supplierProductMap[supplierName]) {
            supplierProductMap[supplierName] = {};
          }
          
          supplierProductMap[supplierName][productName] = productPrice;
        });
        
        // Get all unique supplier names
        const allSupplierNames = Object.keys(supplierProductMap);
        
        // Initialize the result object with all supplier names and default product prices
        const result = {};
        allSupplierNames.forEach(supplierName => {
          result[supplierName] = {};
          Object.keys(supplierProductMap[supplierName]).forEach(productName => {
            result[supplierName][productName] = supplierProductMap[supplierName][productName];
          });
        
          // Check if all products are present for each supplier
          allSupplierNames.forEach(otherSupplierName => {
            if (otherSupplierName !== supplierName) {
              Object.keys(supplierProductMap[otherSupplierName]).forEach(productName => {
                if (!result[supplierName][productName]) {
                  result[supplierName][productName] = 0; // Set product price to 0 if not present
                }
              });
            }
          });
        });
        
        console.log(result);
        

      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json('Error');
    }
  });
  


module.exports = router;