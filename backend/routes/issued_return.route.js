const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const IssuedReturn = require('../db/models/issued_return.model')
const IssuedProduct = require('../db/models/issued_product.model');
const Inventory = require('../db/models/inventory.model');
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

router.route('/getReturn').get(async (req, res) => 
{
    try {
        const data = await IssuedReturn.findAll();

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
        const { quantity, remarks, id } = req.query;

        console.log('id: ' + id);
        console.log('remarks: ' + remarks);

        // Create a new IssuedReturn record
        const newIssuedReturn = await IssuedReturn.create({
            issued_id: id,
            quantity: quantity,
            remarks: remarks,
            // Add other properties as needed based on your model
        });

        // Update the quantity in the IssuedProduct
        const issuedProduct = await IssuedProduct.findOne({
            where: {
                issuance_id: id
            }
        });

        if (issuedProduct) {
            // Subtract the quantity from IssuedProduct
            issuedProduct.quantity -= parseFloat(quantity);
            await issuedProduct.save();
        }

        // Send a response back to the client
        res.status(200).json({ message: 'Data saved successfully', data: newIssuedReturn });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

router.route('/moveToInventory/:id').post(async (req, res) => {
    try {
        const returnId = req.params.id;

        // Find the returned record
        const returnedRecord = await IssuedReturn.findByPk(returnId);

        if (!returnedRecord) {
            return res.status(404).json({ message: 'Returned record not found' });
        }

        // Add returned quantity to the inventory
        const inventoryRecord = await Inventory.findOne({
            where: {
                product_tag_supp_id: returnedRecord.issued_id, // Adjust the condition based on your data model
            },
        });

        if (inventoryRecord) {
            inventoryRecord.quantity += returnedRecord.quantity;
            await inventoryRecord.save();
        } else {
            // If inventory record does not exist, create a new one
            await Inventory.create({
                product_tag_supp_id: returnedRecord.issued_id,
                quantity: returnedRecord.quantity,
            });
        }

        // Delete the returned record
        await returnedRecord.destroy();

        // Send a response back to the client
        res.status(200).json({ message: 'Moved to inventory successfully' });
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