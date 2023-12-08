const router = require("express").Router();
const { where, Op, col, fn } = require("sequelize");
const nodemailer = require("nodemailer");
//master Model
// const MasterList = require('../db/models/masterlist.model')
const { MasterList, UserRole } = require("../db/models/associations"); 
const session = require('express-session')
const jwt = require('jsonwebtoken');

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/login").post(async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await MasterList.findOne({
      where: {
        col_email: username,
      },
    });

    if (user && user.col_Pass === password) {
      const username = { username: user.col_username }
      const accessToken = jwt.sign(username, process.env.ACCESS_SECRET_TOKEN);
      // localStorage.setItem('access-token', accessToken);

      // localStorage.removeItem('access-token');
      res.cookie('access-token', accessToken, {
        // httpOnly : true
      });
      return res.status(200).json({ message: 'Login Success', accessToken: accessToken });
    } else {
      return res.status(202).json({ message: "Incorrect credentials" });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//--------------------Forgot Password------------------//
// Replace these with your Gmail credentials
const gmailEmail = "infintyerpslash@gmail.com";
const gmailPassword = "kaaokvxtaahuckvp";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

router.route("/emailForgotPass").post(async (req, res) => {
  const { email } = req.body;

  console.log(email);
  await MasterList.findAll({
    where: {
      col_email: email,
    },
  })
    .then((forgot) => {
      if (forgot && forgot.length > 0) {
        const code = Math.floor(1000 + Math.random() * 9000); // Generate a random code

        const mailOptions = {
          from: gmailEmail,
          to: email,
          subject: "Verification Code",
          text: `Your verification code is: ${code}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            res
              .status(500)
              .json({ success: false, error: "Email sending failed" });
          } else {
            console.log("Email sent: " + info.response);
            res.status(200).json({ success: true, code: code });
          }
        });
      } else {
        res.status(202).json({ success: true });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    });
});

router.route("/emailResendCode").post(async (req, res) => {
  const toEmail = req.body.toEmail;
  console.log(gmailEmail);
  console.log("wala:" + toEmail);

  const code = Math.floor(1000 + Math.random() * 9000); // Generate a random code

  const mailOptions = {
    from: gmailEmail,
    to: toEmail,
    subject: "Verification Code",
    text: `Your verification code is: ${code}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Email sending failed" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ success: true, code: code });
    }
  });
});

//UPDATE
router.route("/resetPassword").put(async (req, res) => {
  await MasterList.update(
    {
      col_Pass: req.body.password,
    },

    {
      where: {
        col_email: req.body.email,
      },
    }
  )
    .then((update) => {
      if (update) {
        console.log(req.body.email);
        console.log(update);
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(409).json({ errorMessage: err });
    });
});

// FOR USER MASTERLIST MODULE
router.route("/masterTable").get(async (req, res) => {
  try {
    const data = await MasterList.findAll({
      include: {
        model: UserRole,
        required: true,
      },
    });
    // const data = await MasterList.findAll();

    if (data) {
      // console.log(data);
      return res.json(data);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

// CREATE
router.route("/createMaster").post(async (req, res) => {
  try {
    const email = req.body.cemail;

    console.log(req.body.crole);

    // Check if the email already exists in the table
    const existingData = await MasterList.findOne({
      where: {
        col_email: email,
      },
    });

    if (existingData) {
      res.status(202).send("Exist");
    } else {
      // Convert boolean status to "Active" or "Inactive"
      const status = req.body.cstatus ? "Active" : "Inactive";
      // console.log('tyr: ' + req.body.crole)
      // Insert a new record into the table
      const newData = await MasterList.create({
        col_address: req.body.caddress,
        col_phone: req.body.cnum,
        col_username: req.body.cuname,
        col_roleID: req.body.crole,
        col_email: req.body.cemail,
        col_Pass: req.body.cpass,
        col_status: status,
        col_Fname: req.body.cname,
      });

      res.status(200).json(newData);
      // console.log(newDa)
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/updateMaster/:param_id").put(async (req, res) => {
  try {
    const email = req.body.col_email;
    const updatemasterID = req.params.param_id;
    // console.log(updatemasterID)

    // Check if the email already exists in the table for other records
    const existingData = await MasterList.findOne({
      where: {
        col_email: email,
        col_id: { [Op.ne]: updatemasterID }, // Exclude the current record
      },
    });

    if (existingData) {
      res.status(202).send("Exist");
    } else {
      // Convert boolean status to "Active" or "Inactive"
      const status = req.body.col_status ? "Active" : "Inactive";

      // Update the record in the table
      const [affectedRows] = await MasterList.update(
        {
          col_roleID: req.body.col_roleID,
          col_Fname: req.body.col_Fname,
          col_email: req.body.col_email,
          col_Pass: req.body.col_Pass,
          col_phone: req.body.col_phone,
          col_address: req.body.col_address,
          col_username: req.body.col_username,
          col_status: status,
        },
        {
          where: { col_id: updatemasterID },
        }
      );

      res.json({ message: "Data updated successfully", affectedRows });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

//DELETE:
router.route("/deleteMaster/:param_id").delete(async (req, res) => {
  const id = req.params.param_id;
  await MasterList.destroy({
    where: {
      col_id: id,
    },
  })
    .then((del) => {
      if (del) {
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(409);
    });
});

//CREATE
// router.route('/add').post(async (req, res) => {
//     const b = req.body
//     await User.create(b).then((add) => {
//         if(add)
//         {
//             res.json({status : true})
//         }
//         else
//         {
//             res.status(400).json({status: false})
//         }
//     }).catch((err) => {
//         console.error(err)
//         res.status(400)
//     });
// });

// //UPDATE
// router.route('/update').put(async (req, res) => {
//     await User.update(req.body,{
//         where: {
//             id : req.query.id
//         }
//     }).then((update) => {
//         if(update) {
//             res.json({success:true})
//         }
//         else{
//             res.status(400).json({success:false})
//         }
//     }).catch((err) => {
//         console.error(err)
//         res.status(409).json({errorMessage:err})
//     });
// });

// //DELETE:
// router.route('/deleteMaster/:param_id').delete(async (req, res) => {
//     const b = req.query.id
//     await User.destroy({
//         where : {
//             id: b
//         }
//     }).then(
//         (del) => {
//             if(del){
//                 res.json({success : true})
//             }
//             else{
//                 res.status(400).json({success : false})
//             }
//         }
//     ).catch(
//         (err) => {
//             console.error(err)
//             res.status(409)
//         }
//     );
// });

module.exports = router;
