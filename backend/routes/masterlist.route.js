const router = require("express").Router();
const { where, Op, col, fn } = require("sequelize");
const nodemailer = require("nodemailer");
//master Model
// const MasterList = require('../db/models/masterlist.model')
const emailConfig = require("../db/config/email_config");
const {
  MasterList,
  UserRole,
  Activity_Log,
  Department,
} = require("../db/models/associations");
const session = require("express-session");
const jwt = require("jsonwebtoken");

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// router.route("/login").post(async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await MasterList.findOne({
//       where: {
//         col_email: username,
//         col_status: "Active",
//       },
//       include: {
//         model: UserRole,
//       },
//     });

//     if (user && user.col_Pass === password) {
//       const userData = {
//         username: user.col_username,
//         id: user.col_id,
//         Fname: user.col_Fname,
//         userrole: user.userRole.col_rolename,
//       };

//       // Check if user already has an active session
//       if (activeSessions[user.col_id]) {
//         // Invalidate existing session
//         delete activeSessions[user.col_id];
//       }

//       // Generate JWT token
//       const accessToken = jwt.sign(userData, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '1h' });

//       // Store the new session in the activeSessions object
//       activeSessions[user.col_id] = { accessToken, username: userData.username };

//       // Set JWT token as a cookie
//       res.cookie("access-token", accessToken, {
//         // You can configure cookie options here
//         // httpOnly: true // Enable this if you want to prevent client-side access to the cookie
//       });

//       await Activity_Log.create({
//         masterlist_id: userData.id,
//         action_taken: "User logged in",
//       });

//       return res.status(200).json({ message: "Login Success", accessToken: accessToken });
//     } else {
//       return res.status(202).json({ message: "Incorrect credentials" });
//     }
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.route("/logout").post(async (req, res) => {
//   const { accessToken } = req.cookies;

//   try {
//     // Decode the token to extract user information
//     const decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET_TOKEN);

//     // Invalidate the session by removing it from the activeSessions object
//     if (decodedToken && decodedToken.id) {
//       delete activeSessions[decodedToken.id];

//       // Create activity log for user logout
//       await Activity_Log.create({
//         masterlist_id: decodedToken.id,
//         action_taken: "User logged out",
//       });

//       // Clear the cookie to fully log out the user
//       res.clearCookie('access-token');

//       return res.status(200).json({ message: "Logout successful" });
//     } else {
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }
//   } catch (error) {
//     if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
//       // If token is invalid or expired, still log out the user but don't consider it an error
//       return res.status(200).json({ message: "Logout successful" });
//     } else {
//       console.error(error);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//   }
// });
const activeSessions = {};
router.route("/login").post(async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await MasterList.findOne({
      where: {
        col_email: username,
        col_status: "Active",
      },
      include: {
        model: UserRole,
      },
    });

    if (user && user.col_Pass === password) {
      // Check if user already has an active session
      console.log(`activeSessions[user.col_id] ${activeSessions[user.col_id]}`);

      if (activeSessions[user.col_id]) {
        return res
          .status(409)
          .json({ error: "User already logged in on another device" });
      }

      const userData = {
        username: user.col_username,
        id: user.col_id,
        Fname: user.col_Fname,
        userrole: user.userRole.col_rolename,
        department_id: user.department_id,
      };
      const accessToken = jwt.sign(userData, process.env.ACCESS_SECRET_TOKEN);
      res.cookie("access-token", accessToken, {});

      // Store user's session in activeSessions
      activeSessions[user.col_id] = { accessToken };

      await Activity_Log.create({
        masterlist_id: userData.id,
        action_taken: "User logged in",
      });
      res
        .status(200)
        .json({ message: "Login Success", accessToken: accessToken });
      for (const key in activeSessions) {
        delete activeSessions[key];
      }
      return;
    } else {
      return res.status(202).json({ message: "Incorrect credentials" });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Modify logout route to handle session removal
router.route("/logout").post(async (req, res) => {
  const { userId } = req.body;

  try {
    const createActivity = await Activity_Log.create({
      masterlist_id: userId,
      action_taken: "User logged out",
    });

    if (createActivity) {
      // Remove user's session from activeSessions
      delete activeSessions[userId];
      return res.status(200).json({ message: "Log out" });
    } else {
      return res
        .status(202)
        .json({ message: "Cannot Log out, There's a problem" });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// router.route("/login").post(async (req, res) => { this section ang logged in na gagamitin kapag nagkaerror yung new login
//   const { username, password } = req.body;

//   try {
//     const user = await MasterList.findOne({
//       where: {
//         col_email: username,
//         col_status: "Active",
//       },
//       include: {
//         model: UserRole,
//       },
//     });

//     if (user && user.col_Pass === password) {
//       const userData = {
//         username: user.col_username,
//         id: user.col_id,
//         Fname: user.col_Fname,
//         userrole: user.userRole.col_rolename,
//       };
//       const accessToken = jwt.sign(userData, process.env.ACCESS_SECRET_TOKEN);
//       // localStorage.setItem('access-token', accessToken);

//       // localStorage.removeItem('access-token');
//       res.cookie("access-token", accessToken, {
//         // httpOnly : true
//       });
//       await Activity_Log.create({
//         masterlist_id: userData.id,
//         action_taken: "User logged in",
//       });
//       return res
//         .status(200)
//         .json({ message: "Login Success", accessToken: accessToken });
//     } else {
//       return res.status(202).json({ message: "Incorrect credentials" });
//     }
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.route("/logout").post(async (req, res) => {
//   const { userId } = req.body;

//   try {
//     const createActivity = await Activity_Log.create({
//       masterlist_id: userId,
//       action_taken: "User logged out",
//     });

//     if (createActivity) {
//       return res.status(200).json({ message: "Log out" });
//     } else {
//       return res
//         .status(202)
//         .json({ message: "Cannot Log out, There's a problem" });
//     }
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

//--------------------Forgot Password------------------//
// Replace these with your Gmail credentials
const gmailEmail = emailConfig.email;
const gmailPassword = emailConfig.password;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

router.route("/emailForgotPass").post(async (req, res) => {
  const { email } = req.body;

  await MasterList.findAll({
    where: {
      col_email: email,
    },
  })
    .then((forgot) => {
      if (forgot && forgot.length > 0) {
        const code = Math.floor(1000 + Math.random() * 9000);

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
      where: {
        user_type: { [Op.ne]: "Superadmin" },
        col_status: { [Op.ne]: "Archive" },
      },
      order: [["createdAt", "DESC"]],
      include: [
        // {
        //   model: UserRole,
        //   required: true,
        // },

        {
          model: Department,
          required: true,
        },
      ],
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
    const userID = req.body.userId;

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

      // Validate the password
      // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\S{8,}$/;
      // if (!passwordRegex.test(req.body.cpass)) {
      //   return res.status(400).json({
      //     errors: [
      //       {
      //         field: "col_Pass",
      //         message:
      //           "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and no spaces.",
      //       },
      //     ],
      //   });
      // }

      // console.log('tyr: ' + req.body.crole)

      let UserType;

      if (req.body.cpass === "" || req.body.cpass === null) {
        UserType = "Employee";
      } else {
        UserType = "Standard User";
      }

      // Insert a new record into the table
      const newData = await MasterList.create({
        col_address: req.body.caddress,
        col_phone: req.body.cnum,
        col_username: req.body.cuname || null,
        col_roleID: req.body.crole || null,
        department_id: req.body.cdept,
        col_email: req.body.cemail,
        col_Pass: req.body.cpass || null,
        col_status: status,
        col_Fname: req.body.cname,
        user_type: UserType,
      });

      await Activity_Log.create({
        masterlist_id: userID,
        action_taken: `Created a new account for ${req.body.cname}`,
      });

      res.status(200).json(newData);
      // console.log(newDa)
    }
  } catch (err) {
    // console.error(err.name);
    // if(err.name === 'SequelizeValidationError'){
    //   console.log("Error Path: ",err.errors[0].path);
    //   return res.status(400).json({errorPath: err.errors[0].path})
    // }

    // res.status(500).send("An error occurred");

    if (err.name === "SequelizeValidationError") {
      const validationErrors = err.errors.map((error) => ({
        field: error.path,
        message: error.message,
      }));

      // Send validation errors with a 400 status code
      res.status(400).json({ errors: validationErrors });
    } else {
      // Handle other types of errors
      console.error(err);
      res.status(500).send(err);
    }
  }
});

router.route("/updateMaster/:param_id").put(async (req, res) => {
  try {
    const email = req.body.col_email;
    const updatemasterID = req.params.param_id;
    const userId = req.query.userId;

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
      const status = req.body.cstatus ? "Active" : "Inactive";

      let UserType;

      if (req.body.col_Pass === "" || req.body.col_Pass === null) {
        UserType = "Employee";
      } else {
        UserType = "Standard User";
      }

      // Update the record in the table
      const [affectedRows] = await MasterList.update(
        {
          col_roleID: req.body.col_roleID,
          department_id: req.body.department_id,
          col_Fname: req.body.col_Fname,
          col_email: req.body.col_email,
          col_Pass: req.body.col_Pass,
          col_phone: req.body.col_phone,
          col_address: req.body.col_address,
          col_username: req.body.col_username,
          col_status: req.body.col_status,
          user_type: UserType,
        },
        {
          where: { col_id: updatemasterID },
        }
      );

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Updated the information for ${req.body.col_Fname}`,
      });

      res.json({ message: "Data updated successfully", affectedRows });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

//archie:
router.route("/archivemasterList/:param_id").put(async (req, res) => {
  const id = req.params.param_id;
  const userId = req.query.userId;

  try {
    const userName = await MasterList.findOne({
      where: {
        col_id: id,
      },
    });

    const masterlistName = userName.col_Fname;

    const updatedRows = await MasterList.update(
      { col_status: "Archive" },
      { where: { col_id: id } }
    );

    if (updatedRows[0] > 0) {
      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Deleted the account of ${masterlistName}`,
      });
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(409).json({ success: false });
  }
});
// router.route("/deleteMaster/:param_id").delete(async (req, res) => {
//   const id = req.params.param_id;
//   const userId = req.query.userId;

//   const userName = await MasterList.findOne({
//     where: {
//       col_id: id,
//     },
//   });

//   const masterlistName = userName.col_Fname;

//   await MasterList.destroy({
//     where: {
//       col_id: id,
//     },
//   })
//     .then(async (del) => {
//       if (del) {
//         await Activity_Log.create({
//           masterlist_id: userId,
//           action_taken: `Deleted the account of ${masterlistName}`,
//         });
//         res.json({ success: true });
//       } else {
//         res.status(400).json({ success: false });
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(409);
//     });
// });

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

router.route("/viewAuthorization/:id").get(async (req, res) => {
  try {
    const id = req.params.id;

    const user = await MasterList.findByPk(id, {
      include: {
        model: UserRole,
      },
    });

    if (user !== null) {
      // const authorization = user.userRole.col_authorization.split(', ');

      return res.json(user);
    } else {
      return res.status(401);
    }
  } catch (err) {
    return res.status(500);
  }
});

module.exports = router;
