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
    for(const parent of parentArray){
        for(const child of parent.serializedArray){
           if(child.type === 'Product'){
                
           }
           else if(child.type === 'Product Assembly'){

           }
           else if(child.type === 'Product SparePart'){
            
           }
           else if(child.type === 'Product Subpart'){
            
           }
        }
    }

});

module.exports = router;