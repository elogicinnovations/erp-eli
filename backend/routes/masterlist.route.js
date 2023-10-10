const router = require('express').Router()
const {where} = require('sequelize')
const nodemailer = require('nodemailer');
//master Model
const masterlist = require('../db/models/masterlist.model')

const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));


router.route("/login").post(async (req, res) => {
    const { username, password } = req.body;

    try{
      const user = await masterlist.findOne({
        where : {
            col_email : username,
          // password : await bcrypt(password, 10)
          col_Pass: password
        }
      });

      if (user) {
        // const token = await jwt.sign({col_email : username}, "secret")
        return res.status(200).json({message: 'Login Success'})
      }else{
        return res.status(202).json({message: 'incorrect credentials'})
      }
    }catch (e) {
      console.error(e)
      return res.status(500).json({ error : "Internal server error"})
    }
})

//--------------------Forgot Password------------------//
// Replace these with your Gmail credentials
const gmailEmail = 'infintyerpslash@gmail.com';
const gmailPassword = 'kaaokvxtaahuckvp';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// //DELETE:
  router.route("/emailForgotPass").post(async (req, res) => {
    const { email } = req.body;

  console.log(email)
  await masterlist.findAll({
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
          subject: 'Verification Code',
          text: `Your verification code is: ${code}`,
        };
      
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Email sending failed' });
          } else {
            console.log('Email sent: ' + info.response);
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
// router.route('/delete').delete(async (req, res) => {
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