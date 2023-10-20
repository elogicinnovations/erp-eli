const router = require('express').Router()
const {where} = require('sequelize')
const sequelize = require('../db/config/sequelize.config');
const UserRole = require('../db/models/userRole.model')
// const { MasterList, UserRole } = require("../db/models/associations"); 
const session = require('express-session')

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));



router.route("/fetchuserrole").get(async (req, res) => {
    // const departmentName = req.query.departmentName;
   
    UserRole.findAll({
    attributes: [
      'col_roleID',
      'col_rolename',
      'col_desc',
      'createdAt',
      [sequelize.literal("GROUP_CONCAT(col_authorization ORDER BY col_authorization)"), 'consolidated_authorizations'],
    ],
    group: ['col_roleID', 'col_rolename', 'col_desc', 'createdAt'],
    order: [['col_roleID', 'DESC']],
  })
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
            col_roleID: roleId,
        },
        });

        if (!data) {
        // No record found
        return res.status(404).json({ message: 'User role not found' });
        
        }
        // console.log(data)
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
      const existingRole = await UserRole.findOne({
        where: {
          col_rolename: rolename,
          col_roleID: { [sequelize]: roleId },
        },
      });
  
      if (existingRole) {
        return res.status(202).send('Exist');
      } else {
        // Delete existing role authorizations
        await UserRole.destroy({
          where: {
            col_roleID: roleId,
          },
        });
  
        // Insert new role authorizations
        await UserRole.bulkCreate(selectedCheckboxes.map(item => ({
          col_roleID: roleId,
          col_rolename: item.rolename,
          col_desc: item.desc,
          col_authorization: item.authorization,
        })));
  
        return res.status(200).json({ message: 'Data inserted and updated successfully' });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'An error occurred' });
    }
  });
  

//DELETE:
router.route('/deleteRole/:param_id').delete(async (req, res) => {
    const id = req.params.param_id;

  try {
    const deletedUserRole = await UserRole.destroy({
      where: {
        col_roleID: id,
      },
    });

    if (deletedUserRole === 0) {
      // No records were deleted
      return res.status(404).json({ message: 'User role not found' });
    }

    return res.json({ message: 'User role deleted successfully' });
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
        const lastRoleIDResult = await UserRole.findOne({
          order: [['col_roleID', 'DESC']],
          attributes: ['col_roleID'],
        });
  
        const lastRoleID = lastRoleIDResult ? lastRoleIDResult.col_roleID + 1 : 1;
  
        const createdRoles = await Promise.all(
          selectedCheckboxes.map(item => {
            return UserRole.create({
              col_roleID: lastRoleID,
              col_rolename: item.rolename,
              col_desc: item.desc,
              col_authorization: item.authorization,
            });
          })
        );
  
        return res.status(200).json({ message: 'Data inserted successfully', lastRoleID });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });



module.exports = router;