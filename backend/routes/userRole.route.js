const router = require('express').Router()
const {where} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
// const UserRole = require('../db/models/userRole.model')
const { MasterList, UserRole } = require("../db/models/associations"); 
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

router.route("/fetchuserrole").get(async (req, res) => {
    // const departmentName = req.query.departmentName;
   
    UserRole.findAll()
    .then((data) => {
      return res.json(data);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json('Error');
    });
  });

router.route("/fetchuserroleEDIT/:id").get(async (req, res) => {
   
  const roleId = req.params.id;

    try {
        const data = await UserRole.findAll({
        where: {
            col_id: roleId,
        },
        });

        if (!data) {
        // No record found
        return res.status(404).json({ message: 'User role not found' });
        
        }
        console.log(data)
        return res.json(data);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
    }
});


router.post('/editUserrole/:id/:rolename', async (req, res) => {
  const roleId = req.params.id;
  const rolename = req.params.rolename;
  const selectedCheckboxes = req.body.selectedCheckboxes;

  try {
    // Check for the existence of the role by ID
    const existingRole = await UserRole.findByPk(roleId);

    if (!existingRole) {
      return res.status(404).json({ message: 'User role not found' });
    }

    // Update existing role authorizations
    const existingAuthorizationValues = existingRole.col_authorization.split(', ');
    existingRole.col_authorization = selectedCheckboxes
      .map((item) => {
        const existingValue = existingAuthorizationValues.find((value) => value === item.authorization);
        return existingValue || item.authorization;
      })
      .join(', ');

    existingRole.col_desc = selectedCheckboxes[0].desc;
    
    // Use the update method directly on the model
    await UserRole.update({
      col_authorization: existingRole.col_authorization,
      col_desc: existingRole.col_desc,
    }, {
      where: {
        col_id: roleId,
      },
    });

    return res.status(200).json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});


//DELETE:
router.route('/deleteRole/:param_id').delete(async (req, res) => {
    const id = req.params.param_id;

  try {
    await MasterList.findAll({
      where: {
        col_roleID: id,
      },
    })
      .then((check) => {
        if (check && check.length > 0) {
          return res.status(202).json({ success: true });
        }
        else{
           UserRole.destroy({
            where : {
              col_id: id
            }
          })
          .then(
              (del) => {
                  if(del){
                    return res.status(200).json({ message: 'User role deleted successfully' });
                  }
                  else{
                      res.status(400).json({success : false})
                  }
              }
          )
          .catch(
              (err) => {
                  console.error(err)
                  res.status(409)
              }
          );
        }
      })

    // const deletedUserRole = await UserRole.destroy({
    //   where: {
    //     col_id: id,
    //   },
    // });

    // if (deletedUserRole === 0) {
    //   // No records were deleted
    //   return res.status(404).json({ message: 'User role not found' });
    // }

    // return res.json({ message: 'User role deleted successfully' });





  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
});

router.post('/createUserrole/:rolename', async (req, res) => {
  const selectedCheckboxes = req.body.selectedCheckboxes;
  const param_rolename = req.params.rolename;

  try {
      const existingRole = await UserRole.findOne({ where: { col_rolename: param_rolename } });

      if (existingRole) {
          return res.status(202).send('Exist');
      } else {

          // Concatenate the authorization values with commas
          const concatenatedAuthorization = selectedCheckboxes.map(item => item.authorization).join(', ');

          const createdRole = await UserRole.create({
              col_rolename: selectedCheckboxes[0].rolename, // Use the first rolename as an example
              col_desc: selectedCheckboxes[0].desc, // Use the first description as an example
              col_authorization: concatenatedAuthorization,
          });

          return res.status(200).json({ message: 'Data inserted successfully' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
  }
});




module.exports = router;