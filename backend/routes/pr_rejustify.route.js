const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
// const PR_Rejustify = require('../db/models/pr_rejustify.model')
const {
  PR_history,
  PR_Rejustify,
  PR,
  Activity_Log,
  PR_PO,
} = require("../db/models/associations");
const session = require("express-session");
const multer = require("multer");

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.post("/rejustify", upload.single("file"), async (req, res) => {
  try {
    const { id, remarks } = req.body;
    const { userId } = req.query;

    const file = req.file;

    let mimeType = null;
    let fileExtension = null;

    if (file) {
      mimeType = file.mimetype;
      fileExtension = file.originalname.split(".").pop();
    }

    const result = await PR_Rejustify.create({
      file: file ? file.buffer : null,
      pr_id: id,
      remarks: remarks,
      mimeType: mimeType,
      fileExtension: fileExtension,
      masterlist_id: userId
    });

    const PR_historical = await PR_history.create({
      pr_id: id,
      status: "Rejustified",
      remarks: remarks,
    });

    const PR_newData = await PR.update(
      {
        status: "Rejustified",
      },
      {
        where: { id },
      }
    );

    if (PR_newData) {
      const forPR = await PR.findOne({
        where: {
          id: id,
        },
      });

      const PRnum = forPR.pr_num;

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Purchase Request has been rejustified with pr number ${PRnum}`,
      });
    }

    console.log("File data and additional data inserted successfully");
    res.status(200).json();
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/rejustify_for_PO", upload.single("file"), async (req, res) => {
  try {
    const { remarks, pr_id, userId, po_idRejustify } = req.body;
    const file = req.file;

    let mimeType = null;
    let fileExtension = null;

    if (file) {
      mimeType = file.mimetype;
      fileExtension = file.originalname.split(".").pop();
    }

    const result = await PR_Rejustify.create({
      file: file ? file.buffer : null,
      pr_id: pr_id,
      po_id: po_idRejustify,
      remarks: remarks,
      mimeType: mimeType,
      fileExtension: fileExtension,
      masterlist_id: userId
    });

    const PR_historical = await PR_history.create({
      pr_id: pr_id,
      po_id: po_idRejustify,
      status: "Rejustified",
      remarks: `The Purchase Order has been Rejustified with po number ${po_idRejustify}`,
    });

    const PR_newData = await PR_PO.update(
      {
        status: "Rejustified",
      },
      {
        where: { po_id: po_idRejustify },
      }
    );

    if (PR_newData) {

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `The Purchase Order has been Rejustified with po number ${po_idRejustify}`,
      });
    }

    // console.log("File data and additional data inserted successfully");
    res.status(200).json();
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
