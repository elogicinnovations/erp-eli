const router = require('express').Router()
const {where} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const Supplier = require('../db/models/supplier.model')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


router.route('/create').post(async (req, res) => {
    try {
        const code = req.body.suppCode;
        const email = req.body.suppEmail;


        const tin = req.body.suppTin;
        const terms = req.body.suppTerms;
        const telNum = req.body.suppTelNum;

        let finalTin, finalTerms, finalTelNum;

        if (tin === ''){
            finalTin = 0;
        }
        else{
            finalTin = tin;
        }

        if (terms === ''){
            finalTerms = 0;
        }
        else{
            finalTerms = terms;
        }

        if (telNum === ''){
            finalTelNum = 0;
        }
        else{
            finalTelNum = telNum;
        }


        // Check if the supplier code is already exists in the table
        const existingDataCode = await Supplier.findOne({
          where: {
            supplier_code: code,
            // supplier_email: email,
          },
        });
    
        if (existingDataCode) {
          res.status(201).send('Exist');
        } else {
          const newData = await Supplier.create({
            supplier_code: req.body.suppCode,
            supplier_name: req.body.suppName,
            supplier_tin: finalTin,
            supplier_email: req.body.suppEmail,
            supplier_address: req.body.suppAdd,
            supplier_city: req.body.suppCity,
            supplier_postcode: req.body.suppPcode,
            supplier_contactPerson: req.body.suppCperson,
            supplier_number: req.body.suppCnum,
            supplier_Telnumber: finalTelNum,
            supplier_terms: finalTerms,
          });
    
          res.status(200).json(newData);
          // console.log(newDa)
        }
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
      }
});




module.exports = router;