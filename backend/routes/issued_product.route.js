const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const Issued_Product = require('../db/models/issued_product.model')
// const {Inventory, Product, ProductTAGSupplier, Manufacturer, BinLocation,  Category, Supplier} = require('../db/models/associations')
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));






module.exports = router;