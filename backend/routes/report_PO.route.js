const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
// const Supplier_SparePart = require('../db/models/sparePart_supplier..model')
const {
  PR_PO,
  PR_PO_asmbly,
  PR_PO_spare,
  PR_PO_subpart,
  ProductTAGSupplier,
  Assembly_Supplier,
  SparePart_Supplier,
  Subpart_supplier,
  Product,
  SparePart,
  SubPart,
  Assembly,
  PR,
  Supplier,
  MasterList,
  Department,
} = require("../db/models/associations");
const session = require("express-session");

router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/requestPRFiltered").get(async (req, res) => {
  try {
    const { selectedDepartment, selectedStatus, startDate, endDate } = req.query;

    const startDates = new Date(startDate);
    startDates.setDate(startDates.getDate() + 1);
    const startDateds = startDates.toISOString().slice(0, 10) + ' 00:00:00';

    const endDates = new Date(endDate);
    endDates.setDate(endDates.getDate() + 1);
    const endDateds = endDates.toISOString().slice(0, 10) + ' 23:59:59';


    let whereClause = {
      createdAt: {
        [Op.between]: [startDateds, endDateds] 
      },
      status: { [Op.ne]: "To-Receive" },

    };
    
    if (selectedStatus !== 'All') {
      whereClause.status = selectedStatus;
    }
    
    if (selectedDepartment !== 'All') {
      whereClause['$MasterList.department_id$'] = selectedDepartment;
    }
    
    const data = await PR.findAll({
      where: whereClause,
      include: [
        {
          model: MasterList,
          required: true,
          include: [
            {
              model: Department,
              required: true,
            },
          ],
        },
      ],
    });

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

router.route("/requestPR").get(async (req, res) => {
  try {
    const data = await PR.findAll({
      where: {
        status: { [Op.ne]: "To-Receive" },
      },
      include: [
        {
          model: MasterList,
          required: true,

          include: [
            {
              model: Department,
              required: true,
            },
          ],
        },
      ],
    });

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

module.exports = router;
