const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const PR_Rejustify = require('../db/models/pr_rejustify.model')
const {PR_history, PR_Rejustify, PR} = require('../db/models/associations')
const session = require('express-session')
const multer = require('multer');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));



router.post('/rejustify', upload.array('files'), async (req, res) => {
    try {
      const { id, remarks } = req.body;
  
      // Handle the uploaded files
      const fileData = req.files.map((file) => file.buffer);
  
      // Insert file data and additional data into the database using Sequelize
      const result = await PR_Rejustify.create({
        file: Buffer.concat(fileData),
        pr_id: id,  // Assuming 'id' is a column in your model
        remarks: remarks,  // Assuming 'remarks' is a column in your model
      });

      
      const PR_historical = await PR_history.create({
        pr_id: id,
        status: 'For-Rejustify',
        remarks: remarks
      });


      const PR_newData = await PR.update({
        status: 'For-Rejustify'
      },
      {
        where: { id }
      }); 
  
      console.log('File data and additional data inserted successfully');
      res.status(200).json();
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  router.post('/rejustify_for_PO', upload.array('files'), async (req, res) => {
    try {
      const { id, remarks } = req.body;
  
      // Handle the uploaded files
      const fileData = req.files.map((file) => file.buffer);
  
      // Insert file data and additional data into the database using Sequelize
      const result = await PR_Rejustify.create({
        file: Buffer.concat(fileData),
        pr_id: id,  // Assuming 'id' is a column in your model
        remarks: remarks,  // Assuming 'remarks' is a column in your model
      });

      
      const PR_historical = await PR_history.create({
        pr_id: id,
        status: 'For-Rejustify',
        remarks: remarks
      });


      const PR_newData = await PR.update({
        status: 'For-Rejustify (PO)'
      },
      {
        where: { id }
      }); 
  
      console.log('File data and additional data inserted successfully');
      res.status(200).json();
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




module.exports = router;