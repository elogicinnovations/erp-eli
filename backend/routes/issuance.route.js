const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { Issuance, MasterList, CostCenter, Inventory, IssuedProduct, IssuedAssembly,IssuedSpare, IssuedSubpart, Inventory_Assembly, Inventory_Spare, Inventory_Subpart, ProductTAGSupplier } = require("../db/models/associations"); 
// const Issued_Product = require('../db/models/issued_product.model')
// const Inventory = require('../db/models/issued_product.model')


// Get All Issuance
router.route('/getIssuance').get(async (req, res) => 
{
    try {
        const data = await Issuance.findAll({
            include: [{
                model: MasterList,
                 required: true
                },
            {
                model: CostCenter,
                required: true
            }],
            // where: {
            //     issuance_id: req.query.id
            // }
            });

        if (data) {
        return res.json(data);
        } else {
        res.status(400);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json("Error");
    }
});


router.route('/returnForm').get(async (req, res) => 
{
    try {
        const data = await Issuance.findAll({
            include: [{
                model: MasterList,
                 required: true
                },
            {
                model: CostCenter,
                required: true
            }],
            where: {
                issuance_id: req.query.id
            }
            });

        if (data) {
        return res.json(data);
        } else {
        res.status(400);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json("Error");
    }
});



//Create Issuance
router.route('/create').post(async (req, res) => {
    const { addProductbackend } = req.body


        // console.log('addProductbackend'+ reqaddProduct)
        console.log('fromSite'+ req.body)
try {
    const Issue_newData = await Issuance.create({
        from_site: req.body.fromSite,
        issued_to: req.body.issuedTo,
        with_accountability: req.body.withAccountability,
        accountability_refcode: req.body.accountabilityRefcode,
        serial_number: req.body.serialNumber,
        job_order_refcode: req.body.jobOrderRefcode,
        received_by: req.body.receivedBy,
        transported_by: req.body.transportedBy,
        mrs: req.body.mrs,
        remarks: req.body.remarks
    })


        const issuanceee_ID = Issue_newData.issuance_id
        console.log('issuance_ID' + addProductbackend)

        for (const product_issued of addProductbackend) {
            const inventory_id = product_issued.inventory_id
            const quantityee = product_issued.quantity
            const Name = product_issued.name
            const Type = product_issued.type
            console.log('value' + inventory_id)
            console.log('Name' + Name)
            console.log('quantityee' + quantityee)


            if (Type === 'Product') {
                IssuedProduct.create({
                    issuance_id: issuanceee_ID,
                    inventory_id: inventory_id,
                    quantity: quantityee,
                    status: 'Deployed'
                });
            
                Inventory.findAll({
                    where: {
                        inventory_id: inventory_id
                    }
                })
                .then(_inventory => {
                    _inventory.forEach(item => {
                        const db_quantity = item.quantity;
                        const updateQuantity = db_quantity - quantityee;
            
                        Inventory.update(
                            {
                                quantity: updateQuantity
                            },
                            {
                                where: {
                                    inventory_id: inventory_id
                                }
                            }
                        );
                    });
                })
                .catch(error => {
                    console.error('Error fetching inventory:', error);
                });
            }
            
            else if(Type === 'Assembly'){
                IssuedAssembly.create({
                    issuance_id: issuanceee_ID,
                    inventory_Assembly_id: inventory_id,
                    quantity: quantityee,
                    status: 'Deployed'
                });

                Inventory_Assembly.findAll({
                    where: {
                        inventory_id: inventory_id
                    }
                })

                .then(_inventory => {
                    _inventory.forEach(item => {
                        const db_quantity = item.quantity;
                        const updateQuantity = db_quantity - quantityee;
            
                        Inventory_Assembly.update(
                            {
                                quantity: updateQuantity
                            },
                            {
                                where: {
                                    inventory_id: inventory_id
                                }
                            }
                        );
                    });
                })
                .catch(error => {
                    console.error('Error fetching inventory:', error);
                });
            }
            else if(Type === 'Spare'){
                IssuedSpare.create({
                    issuance_id: issuanceee_ID,
                    inventory_Spare_id: inventory_id,
                    quantity: quantityee,
                    status: 'Deployed'
                });


                Inventory_Spare.findAll({
                    where: {
                        inventory_id: inventory_id
                    }
                })

                .then(_inventory => {
                    _inventory.forEach(item => {
                        const db_quantity = item.quantity;
                        const updateQuantity = db_quantity - quantityee;
            
                        Inventory_Spare.update(
                            {
                                quantity: updateQuantity
                            },
                            {
                                where: {
                                    inventory_id: inventory_id
                                }
                            }
                        );
                    });
                })
                .catch(error => {
                    console.error('Error fetching inventory:', error);
                });
            }
            else if(Type === 'Subpart'){
                IssuedSubpart.create({
                    issuance_id: issuanceee_ID,
                    inventory_Subpart_id: inventory_id,
                    quantity: quantityee,
                    status: 'Deployed'
                });

                Inventory_Subpart.findAll({
                    where: {
                        inventory_id: inventory_id
                    }
                })

                .then(_inventory => {
                    _inventory.forEach(item => {
                        const db_quantity = item.quantity;
                        const updateQuantity = db_quantity - quantityee;
            
                        Inventory_Subpart.update(
                            {
                                quantity: updateQuantity
                            },
                            {
                                where: {
                                    inventory_id: inventory_id
                                }
                            }
                        );
                    });
                })
                .catch(error => {
                    console.error('Error fetching inventory:', error);
                });
            }

             
          }
    

    res.status(200).json(Issue_newData);
    } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
};
});
 
module.exports = router;