const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const IssuedReturn = require('../db/models/issued_return.model')
// const IssuedProduct = require('../db/models/issued_product.model');
// const Inventory = require('../db/models/inventory.model');
const { Inventory, ProductTAGSupplier, Product, IssuedReturn, IssuedProduct, 
        IssuedAssembly, IssuedReturn_asm, 
        IssuedReturn_spare, IssuedReturn_subpart,
        IssuedSpare, IssuedSubpart, Issuance
        } = require("../db/models/associations"); 
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

router.route('/getReturn').get(async (req, res) => 
{
    try {
        const data = await IssuedReturn.findAll({
            include: [{
                model: Inventory,
                required: true,

                    include: [{
                        model: ProductTAGSupplier,
                        required: true,

                            include: [{
                                model: Product,
                                required: true
                            }]
                    }]
            },
            {
                model: Issuance,
                required: true
            }]
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

router.route('/issueReturn').post(async (req, res) => {
    try {
        const { issuance_id, return_remarks, status, arrayDataProdBackend, arrayDataAsmBackend, arrayDataSpareBackend,
            arrayDataSubpartBackend} = req.query;

        // console.log("id", issuance_id)
        // console.log("status", status)

        // const arrayDataProdBackend = req.query.arrayDataProdBackend;

        for (const product of arrayDataProdBackend) {        
            await IssuedReturn.create({
                issued_id: issuance_id,
                inventory_id: product.inventory_id,
                quantity: product.quantity,
                status: status,
                remarks: return_remarks,
            });

                const updateRecord = await IssuedProduct.findOne({
                    where: {
                        inventory_id: product.inventory_id,
                    },
                });

                if (updateRecord) {
                    // console.log("check",updateRecord.quantity - product.quantity)
                    const updatedQuantity = updateRecord.quantity - product.quantity
                    

                    await IssuedProduct.update(
                        {
                            quantity: updatedQuantity
                        },
                        {
                            where: {
                                inventory_id: product.inventory_id
                            },
                        }
                    )
                };
        }


// ----------------------------------   assembly --------------------------------


        for (const product of arrayDataAsmBackend) {        
            await IssuedReturn_asm.create({
                issued_id: issuance_id,
                inventory_id: product.inventory_id,
                quantity: product.quantity,
                status: status,
                remarks: return_remarks,
            });

                const updateRecord = await IssuedAssembly.findOne({
                    where: {
                        inventory_Assembly_id: product.inventory_id,
                    },
                });

                if (updateRecord) {
                    // console.log("check",updateRecord.quantity - product.quantity)
                    const updatedQuantity = updateRecord.quantity - product.quantity
                    

                    await IssuedAssembly.update(
                        {
                            quantity: updatedQuantity
                        },
                        {
                            where: {
                                inventory_Assembly_id: product.inventory_id
                            },
                        }
                    )
                };
        };

        // ----------------------------------   Spare part --------------------------------


        for (const product of arrayDataSpareBackend) {        
            await IssuedReturn_spare.create({
                issued_id: issuance_id,
                inventory_id: product.inventory_id,
                quantity: product.quantity,
                status: status,
                remarks: return_remarks,
            });

                const updateRecord = await IssuedSpare.findOne({
                    where: {
                        inventory_Spare_id: product.inventory_id,
                    },
                });

                if (updateRecord) {
                    // console.log("check",updateRecord.quantity - product.quantity)
                    const updatedQuantity = updateRecord.quantity - product.quantity
                    

                    await IssuedSpare.update(
                        {
                            quantity: updatedQuantity
                        },
                        {
                            where: {
                                inventory_Spare_id: product.inventory_id
                            },
                        }
                    )
                };
        };


           // ----------------------------------   Subpart part --------------------------------


           for (const product of arrayDataSubpartBackend) {        
            await IssuedReturn_subpart.create({
                issued_id: issuance_id,
                inventory_id: product.inventory_id,
                quantity: product.quantity,
                status: status,
                remarks: return_remarks,
            });

                const updateRecord = await IssuedSubpart.findOne({
                    where: {
                        inventory_Subpart_id: product.inventory_id,
                    },
                });

                if (updateRecord) {
                    // console.log("check",updateRecord.quantity - product.quantity)
                    const updatedQuantity = updateRecord.quantity - product.quantity
                    

                    await IssuedSubpart.update(
                        {
                            quantity: updatedQuantity
                        },
                        {
                            where: {
                                inventory_Subpart_id: product.inventory_id
                            },
                        }
                    )
                };
        };



        // Send a response back to the client
        res.status(200).json({ message: 'Data saved successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

router.route('/moveToInventory').post(async (req, res) => {

    console.log("pumasok")
    try {
        const {inventoryID, quantity} = req.query;

        const updateRecord = await Inventory.findOne({
            where: {
                inventory_id: inventoryID,
            }
        });

        if (updateRecord) {
            const addToInventory = updateRecord.quantity + quantity


            await Inventory.update(
                {
                    quantity: addToInventory
                },
                {
                    where: {
                        inventory_id: inventoryID,
                    },
                }
            )
            // Send a response back to the client
            res.status(200).json({ message: 'Data saved successfully'});
        };
          

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred' });
    }
});

router.route('/updateStatus/:id').put(async (req, res) => {
    try {
        const returnId = req.params.id;
        const { status } = req.body;

        // Find the returned record
        const returnedRecord = await IssuedReturn.findByPk(returnId);

        if (!returnedRecord) {
            return res.status(404).json({ message: 'Returned record not found' });
        }

        // Update the status
        returnedRecord.status = status;
        await returnedRecord.save();

        // Send a response back to the client
        res.status(200).json({ message: 'Status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred' });
    }
});


 
module.exports = router;