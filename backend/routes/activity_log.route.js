const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const {Activity_Log, MasterList} = require('../db/models/associations')
const session = require('express-session')


router.route('/getlogged').post(async (req, res) => {
    try {
        

    } catch (err) {
        console.error(err);
        res.status(500).json("Error");
    }
});


module.exports = router;