const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const IssuedReturn = require('../db/models/issued_return.model')
// const IssuedProduct = require('../db/models/issued_product.model');
// const Inventory = require('../db/models/inventory.model');
const { Inventory, ProductTAGSupplier, Product, IssuedReturn, 
        IssuedProduct, IssuedAssembly, IssuedReturn_asm, 
        IssuedReturn_spare, IssuedReturn_subpart,
        IssuedSpare, IssuedSubpart, Issuance, 
        Inventory_Assembly, Assembly_Supplier, Inventory_Spare,
        Assembly, SparePart, SubPart, SparePart_Supplier, Subpart_supplier, Inventory_Subpart
        } = require("../db/models/associations"); 
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// router.route('/getReturn').get(async (req, res) => {
//     try {
//         const data = await IssuedReturn.findAll({
//             include: [{
//                     model: Inventory,
//                     required: true,

//                     include: [{
//                             model: ProductTAGSupplier,
//                             required: true,

//                             include: [{
//                                 model: Product,
//                                 required: true
//                             }]
//                         }]
//                 },
//                 {
//                     model: Issuance,
//                     required: true
//                 }
//             ],
//             where: {
//                 status: "To be Return"
//             }
//         });

//         if (data) {
//             return res.json(data);
//         } else {
//             res.status(400);
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json("Error");
//     }
// });


router.route('/fetchReturn').get(async (req, res) => {
    try {
        // const productData = await IssuedReturn.findAll({
        //     include: [{
        //             model: Inventory,
        //             required: true,

        //             include: [{
        //                     model: ProductTAGSupplier,
        //                     required: true,

        //                     include: [{
        //                         model: Product,
        //                         required: true
        //                     }]
        //                 }]
        //         },
        //         {
        //             model: Issuance,
        //             required: true
        //         }
        //     ],
        //     where: {
        //         status: "To be Return"
        //     }
        // });

        const productData = await IssuedReturn.findAll({
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
                }
            ],
            where: {
                [Op.or]: [
                    { status: "To be Return" },
                    { status: "Retained" }
                ]
            }
        });

        const asmData = await IssuedReturn_asm.findAll({
            include: [{
                    model: Inventory_Assembly,
                    required: true,

                    include: [{
                            model: Assembly_Supplier,
                            required: true,

                            include: [{
                                model: Assembly,
                                required: true
                            }]
                        }]
                },
                {
                    model: Issuance,
                    required: true
                }
            ],
            where: {
                [Op.or]: [
                    { status: "To be Return" },
                    { status: "Retained" }
                ]
            }
        });

        const spareData = await IssuedReturn_spare.findAll({
            include: [{
                    model: Inventory_Spare,
                    required: true,

                    include: [{
                            model: SparePart_Supplier,
                            required: true,

                            include: [{
                                model: SparePart,
                                required: true
                            }]
                        }]
                },
                {
                    model: Issuance,
                    required: true
                }
            ],
            where: {
                [Op.or]: [
                    { status: "To be Return" },
                    { status: "Retained" }
                ]
            }
        });

        const subpartData = await IssuedReturn_subpart.findAll({
            include: [{
                    model: Inventory_Subpart,
                    required: true,

                    include: [{
                            model: Subpart_supplier,
                            required: true,

                            include: [{
                                model: SubPart,
                                required: true
                            }]
                        }]
                },
                {
                    model: Issuance,
                    required: true
                }
            ],
            where: {
                [Op.or]: [
                    { status: "To be Return" },
                    { status: "Retained" }
                ]
            }
        });

        return res.json({
            product: productData,
            assembly: asmData,
            spare: spareData,
            subpart: subpartData,
          });

       
    } catch (err) {
        console.error(err);
        res.status(500).json("Error");
    }
});



router.route('/issueReturn').post(async (req, res) => {
    try {
        const{ 
                issuance_id, return_remarks, status, 
                arrayDataProdBackend, arrayDataAsmBackend, 
                arrayDataSpareBackend, arrayDataSubpartBackend
            } = req.body;

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

        res.status(200).json({ message: 'Data saved successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

router.route('/moveToInventory').post(async (req, res) => {
    try {
        const {invetory_id, table_quantity, primary_id, types} = req.body;

        if(types === "product"){
            const updateRecord = await Inventory.findOne({
                where: {
                    inventory_id: invetory_id,
                }
            });
    
            if (updateRecord) {
                const addToInventory = updateRecord.quantity + table_quantity
    
                const inventory_update = await Inventory.update(
                    {
                        quantity: addToInventory
                    },
                    {
                        where: {
                            inventory_id: invetory_id,
                        },
                    }
                )
    
                if(inventory_update){
                    const prd_return = await IssuedReturn.update(
                        {
                            status: 'Returned',
                        },
                        {
                            where: {
                                id: primary_id,
                            },
                        }
                    )
    
                    if (prd_return){
                        return res.status(200).json({ message: 'Data saved successfully'});
                    };
                   
                };
    
            }
        }
        else if (types === "assembly"){
            const updateRecord = await Inventory_Assembly.findOne({
                where: {
                    inventory_id: invetory_id,
                }
            });
    
            if (updateRecord) {
                const addToInventory = updateRecord.quantity + table_quantity
    
                const inventory_update = await Inventory_Assembly.update(
                    {
                        quantity: addToInventory
                    },
                    {
                        where: {
                            inventory_id: invetory_id,
                        },
                    }
                )
    
                if(inventory_update){
                    const prd_return = await IssuedReturn_asm.update(
                        {
                            status: 'Returned',
                        },
                        {
                            where: {
                                id: primary_id,
                            },
                        }
                    )
                    if (prd_return){
                        return res.status(200).json({ message: 'Data saved successfully'});
                    };
                   
                };
            }
        }
        else if (types === "spare"){
            const updateRecord = await Inventory_Spare.findOne({
                where: {
                    inventory_id: invetory_id,
                }
            });
    
            if (updateRecord) {
                const addToInventory = updateRecord.quantity + table_quantity

                const inventory_update = await Inventory_Spare.update(
                    {
                        quantity: addToInventory
                    },
                    {
                        where: {
                            inventory_id: invetory_id,
                        },
                    }
                )
    
                if(inventory_update){
                    const prd_return = await IssuedReturn_spare.update(
                        {
                            status: 'Returned',
                        },
                        {
                            where: {
                                id: primary_id,
                            },
                        }
                    )
    
                    if (prd_return){
                        return res.status(200).json({ message: 'Data saved successfully'});
                    };
                   
                };
            }
        }
        else if (types === "subpart"){
            const updateRecord = await Inventory_Subpart.findOne({
                where: {
                    inventory_id: invetory_id,
                }
            });
    
            if (updateRecord) {
                const addToInventory = updateRecord.quantity + table_quantity

                const inventory_update = await Inventory_Subpart.update(
                    {
                        quantity: addToInventory
                    },
                    {
                        where: {
                            inventory_id: invetory_id,
                        },
                    }
                )
    
                if(inventory_update){
                    const prd_return = await IssuedReturn_subpart.update(
                        {
                            status: 'Returned',
                        },
                        {
                            where: {
                                id: primary_id,
                            },
                        }
                    )
    
                    if (prd_return){
                        return res.status(200).json({ message: 'Data saved successfully'});
                    };
                   
                };
            }
        };

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred' });
    }
});

router.route('/retain').post(async (req, res) => {
    try {
        const { types, primaryID } = req.body;


        if(types === "product"){
            const prd_return = await IssuedReturn.update(
                {
                    status: 'Retained',

                },
                {
                    where: {
                        id: primaryID,
                    },
                }
            )

            if (prd_return){
                // Send a response back to the client
                return res.status(200).json({ message: 'Data saved successfully'});
            };
        }
        else if(types === "assembly"){
            const prd_return = await IssuedReturn_asm.update(
                {
                    status: 'Retained',

                },
                {
                    where: {
                        id: primaryID,
                    },
                }
            )

            if (prd_return){
                // Send a response back to the client
                return res.status(200).json({ message: 'Data saved successfully'});
            };
        }
        else if(types === "spare"){
            const prd_return = await IssuedReturn_spare.update(
                {
                    status: 'Retained',

                },
                {
                    where: {
                        id: primaryID,
                    },
                }
            )

            if (prd_return){
                // Send a response back to the client
                return res.status(200).json({ message: 'Data saved successfully'});
            };
        }
        else if(types === "subpart"){
            const prd_return = await IssuedReturn_subpart.update(
                {
                    status: 'Retained',

                },
                {
                    where: {
                        id: primaryID,
                    },
                }
            )

            if (prd_return){
                // Send a response back to the client
                return res.status(200).json({ message: 'Data saved successfully'});
            };
        }

    
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred' });
    }
});


 
module.exports = router;