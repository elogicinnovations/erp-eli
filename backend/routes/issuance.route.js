const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const { Issuance, MasterList, CostCenter, Inventory, 
        IssuedProduct, IssuedAssembly,IssuedSpare, IssuedSubpart, 
        Inventory_Assembly, Inventory_Spare, Inventory_Subpart, 
        ProductTAGSupplier, Product, Assembly_Supplier, Assembly,
        SparePart_Supplier, SparePart, Subpart_supplier, SubPart
    } = require("../db/models/associations"); 
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


router.route('/fetchApprove').get(async (req, res) => {
    try {
        const productData = await IssuedProduct.findAll({
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
                issuance_id: req.query.id
            }
        });

        const asmData = await IssuedAssembly.findAll({
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
                issuance_id: req.query.id
            }
        });

        const spareData = await IssuedSpare.findAll({
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
                issuance_id: req.query.id
            }
        });

        const subpartData = await IssuedSubpart.findAll({
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
                issuance_id: req.query.id
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


router.route('/approval').post(async (req, res) => {
    const approve = await Issuance.update(
        {
            status: 'Approved'
        },
        {
            where:{
                issuance_id: req.query.id
            }
        }

        
    )
    if(approve){
        

        IssuedProduct.findAll({
            where: {
                issuance_id: req.query.id
            }
        })
        .then(_issuance => {
            _issuance.forEach(item => {
                const db_inventory = item.inventory_id;
                const db_quantityee = item.quantity;
    
                Inventory.findAll({
                    where: {
                        inventory_id: db_inventory
                    }
                })

                .then(_inventory => {
                    _inventory.forEach(item => {
                        const db_quantity = item.quantity;
                        const updateQuantity = db_quantity - db_quantityee;
            
                        Inventory.update(
                            {
                                quantity: updateQuantity
                            },
                            {
                                where: {
                                    inventory_id: db_inventory
                                }
                            }
                        );
                    });
                })
               
            });
        })
        .catch(error => {
            console.error('Error fetching inventory:', error);
        });

// ----------------------------------ASSEMBLY ------------------------------
        IssuedAssembly.findAll({
            where: {
                issuance_id: req.query.id
            }
        })
        .then(_issuance => {
            _issuance.forEach(item => {
                const db_inventory = item.inventory_Assembly_id;
                const db_quantityee = item.quantity;
    
                Inventory_Assembly.findAll({
                    where: {
                        inventory_id: db_inventory
                    }
                })

                .then(_inventory => {
                    _inventory.forEach(item => {
                        const db_quantity = item.quantity;
                        const updateQuantity = db_quantity - db_quantityee;
            
                        Inventory_Assembly.update(
                            {
                                quantity: updateQuantity
                            },
                            {
                                where: {
                                    inventory_id: db_inventory
                                }
                            }
                        );
                    });
                })
               
            });
        })
        .catch(error => {
            console.error('Error fetching inventory:', error);
        });



        // ----------------------------------Spare Part ------------------------------
        IssuedSpare.findAll({
            where: {
                issuance_id: req.query.id
            }
        })
        .then(_issuance => {
            _issuance.forEach(item => {
                const db_inventory = item.inventory_Spare_id;
                const db_quantityee = item.quantity;
    
                Inventory_Spare.findAll({
                    where: {
                        inventory_id: db_inventory
                    }
                })

                .then(_inventory => {
                    _inventory.forEach(item => {
                        const db_quantity = item.quantity;
                        const updateQuantity = db_quantity - db_quantityee;
            
                        Inventory_Spare.update(
                            {
                                quantity: updateQuantity
                            },
                            {
                                where: {
                                    inventory_id: db_inventory
                                }
                            }
                        );
                    });
                })
               
            });
        })
        .catch(error => {
            console.error('Error fetching inventory:', error);
        });

        // ----------------------------------Sub Part ------------------------------
        IssuedSubpart.findAll({
            where: {
                issuance_id: req.query.id
            }
        })
        .then(_issuance => {
            _issuance.forEach(item => {
                const db_inventory = item.inventory_Subpart_id;
                const db_quantityee = item.quantity;
    
                Inventory_Subpart.findAll({
                    where: {
                        inventory_id: db_inventory
                    }
                })

                .then(_inventory => {
                    _inventory.forEach(item => {
                        const db_quantity = item.quantity;
                        const updateQuantity = db_quantity - db_quantityee;
            
                        Inventory_Subpart.update(
                            {
                                quantity: updateQuantity
                            },
                            {
                                where: {
                                    inventory_id: db_inventory
                                }
                            }
                        );
                    });
                })
               
            });
        })
        .catch(error => {
            console.error('Error fetching inventory:', error);
        });

    }

    res.status(200).json();
    
})

router.route('/reject').post(async (req, res) => {
    await Issuance.update(
        {
            status: 'Rejected'
        },
        {
            where:{
                issuance_id: req.query.id
            }
        }
    )
    res.status(200).json();

})


router.route('/approvalIssuance').get(async (req, res) => 
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
        remarks: req.body.remarks,
        status: 'Pending'
    })


        const issuanceee_ID = Issue_newData.issuance_id
        // console.log('issuance_ID' + addProductbackend)

        for (const product_issued of addProductbackend) {
            const inventory_id = product_issued.inventory_id
            const quantityee = product_issued.quantity
            const Name = product_issued.name
            const Type = product_issued.type
            // console.log('value' + inventory_id)
            // console.log('Name' + Name)
            // console.log('quantityee' + quantityee)


            if (Type === 'Product') {
                IssuedProduct.create({
                    issuance_id: issuanceee_ID,
                    inventory_id: inventory_id,
                    quantity: quantityee,
                    status: ''
                });
            
                
            }
            
            else if(Type === 'Assembly'){
                IssuedAssembly.create({
                    issuance_id: issuanceee_ID,
                    inventory_Assembly_id: inventory_id,
                    quantity: quantityee,
                    status: ''
                });

            }
            else if(Type === 'Spare'){
                IssuedSpare.create({
                    issuance_id: issuanceee_ID,
                    inventory_Spare_id: inventory_id,
                    quantity: quantityee,
                    status: ''
                });

            }
            else if(Type === 'Subpart'){
                IssuedSubpart.create({
                    issuance_id: issuanceee_ID,
                    inventory_Subpart_id: inventory_id,
                    quantity: quantityee,
                    status: ''
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