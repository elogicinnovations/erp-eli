const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const { MasterList, UserRole } = require("../db/models/associations");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");

// const upload = multer({
//     dest: 'uploads/', // Temporary directory for uploads (adjust path as needed)
//     limits: { fileSize: 1000000 }, // Limit file size to 1MB (adjust as needed)
//     fileFilter: (req, file, cb) => {
//       const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
//       const extension = file.originalname.split('.').pop().toLowerCase();
//       if (allowedExtensions.includes(extension)) {
//         cb(null, true);
//       } else {
//         cb(new Error('Only JPG, JPEG, PNG, and WEBP files allowed!'), false);
//       }
//     }
// });

router.route("/fetchInfo").get(async (req, res) => {
  try {
    const data = await MasterList.findAll({
      include: [
        {
          model: UserRole,
          required: true,
        },
      ],
      where: {
        col_id: req.query.userId,
      },
    });

    // // Check if image data exists
    // if (data && data.length > 0 && data[0].image) {
    //   // Read image file as binary data
    //   const imageData = fs.readFileSync(data[0].image);

    //   // Convert binary image data to base64
    //   const base64ImageData = Buffer.from(imageData).toString('base64');

    //   // Replace binary image data with base64-encoded string
    //   data[0].image = base64ImageData;
    // }

    return res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/update").put(async (req, res) => {
  try {
    const {
      userID,
      name,
      address,
      username,
      cnum,
      email,
      productImages,
      currentPass,
      newPass,
    } = req.body;

    const User = await MasterList.findAll({
      where: { col_id: userID },
    });
    if (currentPass != User[0].col_Pass) {
      return res.status(201).json("Invalid User");
    } else {
      const updatedUser = await MasterList.update(
        {
          col_Fname: name,
          col_address: address,
          col_username: username,
          col_phone: cnum,
          col_email: email,
          image: productImages,
          col_Pass: newPass,
        },
        {
          where: { col_id: userID },
        }
      );

      if (updatedUser) {
        // return res.status(200).json("User Updated Successfully");
      } else {
        return res.status(400).json("Failed to Update User");
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error Updating User");
  }
});
module.exports = router;
