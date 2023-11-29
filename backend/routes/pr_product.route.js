const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const PR_product = require('../db/models/pr_products.model')
// const {Assembly_Supplier, Assembly, Assembly_SparePart} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));




module.exports = router;