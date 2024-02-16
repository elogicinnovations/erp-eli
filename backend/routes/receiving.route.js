const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {
    Receiving_Prd,
    Receiving_Asm,
    Receiving_Spare,
    Receiving_Subpart,
} = require('../db/models/associations')
const session = require('express-session')

router.route('/insertReceived').post(async (req, res) => {

    const parentArray = req.body.addReceivebackend;
    const shippingFee = req.body.shippingFee;
    let totalReceived = 0;
    let freighCost = 0;

for (const parent of parentArray) {
    for (const child of parent.serializedArray) {
        totalReceived += parseInt(child.Received_quantity);
        freighCost = (shippingFee / totalReceived).toFixed(2);

        if (child.type === 'Product') {
            Receiving_Prd.create({
                canvassed_id: child.canvassed_ID,
                set_quantity: child.set_quantity || 0,
                freight_cost: freighCost,
              })
        } else if (child.type === 'Product Assembly') {
            Receiving_Asm.create({
                canvassed_id: child.canvassed_ID,
                set_quantity: child.set_quantity || 0,
                freight_cost: freighCost,
              })
        } else if (child.type === 'Product SparePart') {
            Receiving_Spare.create({
                canvassed_id: child.canvassed_ID,
                set_quantity: child.set_quantity || 0,
                freight_cost: freighCost,
              })
        } else if (child.type === 'Product Subpart') {
            Receiving_Subpart.create({
                canvassed_id: child.canvassed_ID,
                set_quantity: child.set_quantity || 0,
                freight_cost: freighCost,
              })
        }
    }
}



console.log(`Total Received: ${totalReceived}`);
console.log(`Fr ${freighCost}`);

return res.status(200).json()

});

module.exports = router;