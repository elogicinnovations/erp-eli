const router = require('express').Router()
const {where, Op} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const PR_Rejustify = require('../db/models/pr_rejustify.model')
const {PR_history, PR_Rejustify, PR, Activity_Log} = require('../db/models/associations')
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



router.post('/rejustify', upload.single('file'), async (req, res) => {
    try {
      const { id, remarks } = req.body;
    const { userId } = req.query;

    const file = req.file;

    let mimeType = null;
    let fileExtension = null;

    if (file) {
      mimeType = file.mimetype;
      fileExtension = file.originalname.split('.').pop();
    }

    const result = await PR_Rejustify.create({
      file: file ? file.buffer : null,
      pr_id: id,
      remarks: remarks,
      mimeType: mimeType,
      fileExtension: fileExtension,
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

      if(PR_newData){
        const forPR = await PR.findOne({
          where: {
            id: id,
          }
        });

        const PRnum = forPR.pr_num;

        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Purchase Request has been rejustified with pr number ${PRnum}`,
      });
    }
  
      console.log('File data and additional data inserted successfully');
      res.status(200).json();
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  router.post('/rejustify_for_PO', upload.single('file'), async (req, res) => {
    try {
      const { id, remarks, userId } = req.body;
      const file = req.file;

      let mimeType = null;
      let fileExtension = null;
  
      if (file) {
        mimeType = file.mimetype;
        fileExtension = file.originalname.split('.').pop();
      }

      const result = await PR_Rejustify.create({
        file: file ? file.buffer : null,
        pr_id: id,
        remarks: remarks,
        mimeType: mimeType,
        fileExtension: fileExtension,
      });

      
      const PR_historical = await PR_history.create({
        pr_id: id,
        status: 'For-Rejustify (PO)',
        remarks: remarks
      });


      const PR_newData = await PR.update({
        status: 'For-Rejustify (PO)'
      },
      {
        where: { id }
      }); 

      if(PR_newData){
        const forPR = await PR.findOne({
          where: {
            id: id,
          },
        });

        const PRnum = forPR.pr_num;

        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `The Purchase Order has been Rejustified with pr number ${PRnum}`,
        });
      }
  
      console.log('File data and additional data inserted successfully');
      res.status(200).json();
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




module.exports = router;