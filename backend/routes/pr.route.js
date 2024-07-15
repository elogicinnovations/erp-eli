const router = require("express").Router();
const { where, Op } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const {
  PR,
  PR_product,
  PR_assembly,
  PR_Rejustify,
  PR_subPart,
  PR_history,
  PR_PO,
  PR_PO_asmbly,
  PR_sparePart,
  PR_PO_spare,
  PR_PO_subpart,
  Activity_Log,
  MasterList,
  Department,
  Receiving_PO,
  ProductTAGSupplier,
  PO_REJECT,
  PR_REJECT,
  Supplier,
} = require("../db/models/associations");
const session = require("express-session");
const moment = require("moment-timezone");
router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.route("/fetchTable").get(async (req, res) => {
  try {
    const data = await PR.findAll({
      where: {
        status: { [Op.ne]: "Cancelled" },
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
      order: [["createdAt", "DESC"]],
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

router.route("/PRfilter").get(async (req, res) => {
  try {
    const { strDate, enDate, selectedStatus } = req.query;

    const startDates = new Date(strDate);
    startDates.setDate(startDates.getDate() + 1);
    const startDate = startDates.toISOString().slice(0, 10) + " 00:00:00";

    const endDates = new Date(enDate);
    endDates.setDate(endDates.getDate() + 1);
    const endDate = endDates.toISOString().slice(0, 10) + " 23:59:59";

    let whereClause = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (selectedStatus !== "All") {
      whereClause["$purchase_req.status$"] = selectedStatus;
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
      order: [["createdAt", "ASC"]],
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

router.route("/fetchTable_PO").get(async (req, res) => {
  try {
    const data = await PR_PO.findAll({
      include: [
        {
          model: PR,
          required: true,
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
        },
        {
          model: ProductTAGSupplier,
          required: true,
          include: [
            {
              model: Supplier,
              required: true,
            },
          ],
        },
      ],
    });

    if (data) {
      const uniquePoMap = new Map();

      // Filter data to ensure only unique po_ids and exclude those with status "Received"
      const uniqueData = data.filter((item) => {
        if (item.status !== "Received" && !uniquePoMap.has(item.po_id)) {
          uniquePoMap.set(item.po_id, true);
          return true;
        }
        return false;
      });

      // Sort the unique data: first by status null, then by status "To-receive"
      uniqueData.sort((a, b) => {
        if (a.status === null && b.status !== null) {
          return -1;
        }
        if (a.status !== null && b.status === null) {
          return 1;
        }
        if (a.status === "To-Receive" && b.status !== "To-Receive") {
          return -1;
        }
        if (a.status !== "To-Receive" && b.status === "To-Receive") {
          return 1;
        }
        return 0;
      });

      return res.json(uniqueData);
    } else {
      res.status(400).json("No data found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/PO_filter").get(async (req, res) => {
  try {
    const { strDate, enDate, selectedStatus } = req.query;

    const startDates = new Date(strDate);
    startDates.setDate(startDates.getDate() + 1);
    const startDate = startDates.toISOString().slice(0, 10) + " 00:00:00";

    const endDates = new Date(enDate);
    endDates.setDate(endDates.getDate() + 1);
    const endDate = endDates.toISOString().slice(0, 10) + " 23:59:59";

    let whereClause = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (selectedStatus !== "All") {
      whereClause["$purchase_req_canvassed_prd.status$"] =
        selectedStatus === "null" ? null : selectedStatus;
    }

    const data = await PR_PO.findAll({
      where: whereClause,
      include: [
        {
          model: PR,
          required: true,

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
        },
        {
          model: ProductTAGSupplier,
          required: true,
          include: [
            {
              model: Supplier,
              required: true,
            },
          ],
        },
      ],
    });

    if (data) {
      const uniquePoMap = new Map();

      // Filter data to ensure only unique po_ids and exclude those with status "Received"
      const uniqueData = data.filter((item) => {
        if (!uniquePoMap.has(item.po_id)) {
          uniquePoMap.set(item.po_id, true);
          return true;
        }
        return false;
      });

      return res.json(uniqueData);
    } else {
      res.status(400);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchTable_PO_view").get(async (req, res) => {
  try {
    const data = await PR.findAll({
      where: {
        id: req.query.id,
      },
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
router.route("/pr_update").post(async (req, res) => {
  try {
    const { dateNeed, useFor, remarks, updatedProducts, id, userId } = req.body;

    const isUpdatedMother = await PR.update(
      {
        date_needed: dateNeed,
        used_for: useFor,
        remarks: remarks,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (isUpdatedMother) {
      await PR_product.destroy({
        where: {
          pr_id: id,
        },
      });

      await Promise.all(
        updatedProducts.map(async (data) => {
          return await PR_product.create({
            pr_id: id,
            product_id: data.product_id,
            quantity: data.quantity,
            description: data.description,
            isPO: false,
          });
        })
      );

      await PR_history.create({
        pr_id: id,
        status: "For-Approval",
        remarks: `Purchase Request: Edit the pr for ${id}`,
      });
      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Purchase Request: Edit the pr for ${id}`,
      });

      return res.status(200).json();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/fetchView").get(async (req, res) => {
  try {
    const data = await PR.findOne({
      where: {
        id: req.query.id,
      },
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

router.route("/lastPRNumber").get(async (req, res) => {
  // try {

  //     const latestPR = await PR.findOne({
  //         attributes: [[sequelize.fn('max', sequelize.col('pr_num')), 'latestPRNumber']],
  //       });
  //     const latestPRNumber = latestPR.getDataValue('latestPRNumber');

  //     // console.log('Latest PR Number:', latestPRNumber);
  //     return res.json(latestPRNumber);

  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json("Error");
  // }

  try {
    const latestPR = await PR.findOne({
      attributes: [
        [sequelize.fn("max", sequelize.col("pr_num")), "latestNumber"],
      ],
    });
    let latestNumber = latestPR.getDataValue("latestNumber");

    console.log("Latest Number:", latestNumber);

    // Increment the latestNumber by 1 for a new entry
    latestNumber =
      latestNumber !== null ? (parseInt(latestNumber, 10) + 1).toString() : "1";

    // Do not create a new entry, just return the incremented value
    return res.json(latestNumber.padStart(8, "0"));
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});

router.route("/create").post(async (req, res) => {
  try {
    const { prNum, dateNeed, useFor, remarks, addProductbackend, userId } =
      req.body;

    const PR_newData = await PR.create({
      pr_num: prNum,
      date_needed: dateNeed,
      used_for: useFor,
      masterlist_id: userId,
      remarks: remarks,
      status: "For-Approval",
    });
    const createdID = PR_newData.id;
    const PR_historical = await PR_history.create({
      pr_id: createdID,
      status: "For-Approval",
      remarks: remarks,
    });

    for (const prod of addProductbackend) {
      const prod_value = prod.value;
      const prod_quantity = prod.quantity;
      const prod_desc = prod.desc;
      const prod_type = prod.type;

      if (prod_type === "Product") {
        await PR_product.create({
          pr_id: createdID,
          product_id: prod_value,
          quantity: prod_quantity,
          description: prod_desc,
          isPO: false,
        });
      } else if (prod_type === "Assembly") {
        await PR_assembly.create({
          pr_id: createdID,
          assembly_id: prod_value,
          quantity: prod_quantity,
          description: prod_desc,
        });
      } else if (prod_type === "Spare") {
        await PR_sparePart.create({
          pr_id: createdID,
          spare_id: prod_value,
          quantity: prod_quantity,
          description: prod_desc,
        });
        console.log("Spare insert");
      } else if (prod_type === "SubPart") {
        await PR_subPart.create({
          pr_id: createdID,
          subPart_id: prod_value,
          quantity: prod_quantity,
          description: prod_desc,
        });
        console.log("SubPart insert");
      }

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Purchase Request: Created a new pr for ${prod_type} with number of ${prNum}`,
      });
    }

    res.status(200).json();
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/fetchDepartment").get(async (req, res) => {
  try {
    const data = await PR.findOne({
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
      where: {
        id: req.query.id,
      },
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

router.route("/lastPRNumber").get(async (req, res) => {
  // try {

  //     const latestPR = await PR.findOne({
  //         attributes: [[sequelize.fn('max', sequelize.col('pr_num')), 'latestPRNumber']],
  //       });
  //     const latestPRNumber = latestPR.getDataValue('latestPRNumber');

  //     // console.log('Latest PR Number:', latestPRNumber);
  //     return res.json(latestPRNumber);

  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json("Error");
  // }

  try {
    const latestPR = await PR.findOne({
      attributes: [
        [sequelize.fn("max", sequelize.col("pr_num")), "latestNumber"],
      ],
    });

    res.status(200).json();
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/reject").post(async (req, res) => {
  try {
    const { id, userId, rejectRemarks } = req.query;

    const Reject_Remarks = await PR_REJECT.create({
      pr_id: id,
      remarks: rejectRemarks,
      masterlist_id: userId,
    });

    if (Reject_Remarks) {
      const PR_newData = await PR.update(
        {
          status: "Rejected",
        },
        {
          where: { id: id },
        }
      );

      const forPR = await PR.findOne({
        where: {
          id: id,
        },
      });

      const PRnum = forPR.pr_num;

      const PR_historical = await PR_history.create({
        pr_id: id,
        status: "Rejected",
        remarks: `Purchase Request has been Rejected with pr number ${PRnum}`,
      });

      if (PR_historical) {
        await Activity_Log.create({
          masterlist_id: userId,
          action_taken: `Purchase Request has been Rejected with pr number ${PRnum}`,
        });

        res.status(200).json();
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});
router.route("/fetchRejectHistory").get(async (req, res) => {
  try {
    const { pr_id } = req.query;
    // Fetch the data
    const prRejectData = await PR_REJECT.findAll({
      where: { pr_id: pr_id },
      include: [{ model: MasterList, required: true }],
    });

    const poRejectData = await PO_REJECT.findAll({
      where: { pr_id: pr_id },
      include: [{ model: MasterList, required: true }],
    });

    const prRejustifyData = await PR_Rejustify.findAll({
      where: { pr_id: pr_id },
      include: [{ model: MasterList, required: true }],
    });

    // Extract the dataValues from each result and add a source field
    const prRejectValues = prRejectData.map((item) => ({
      ...item.dataValues,
      source: "REJECTION",
    }));

    const poRejectValues = poRejectData.map((item) => ({
      ...item.dataValues,
      source: `REJECTION (PO# ${item.po_id})`,
    }));

    const prRejustifyValues = prRejustifyData.map((item) => ({
      ...item.dataValues,
      source:
        item.po_id === null
          ? `REJUSTIFICATION`
          : `REJUSTIFICATION (PO# ${item.po_id})`,
    }));

    // Combine the dataValues into one array
    const combinedData = [
      ...prRejectValues,
      ...poRejectValues,
      ...prRejustifyValues,
    ];

    // Sort the combined data by createdAt column in ascending order
    combinedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Send the sorted data as a response
    res.json(combinedData);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error");
  }
});
router.route("/rejectPO").post(async (req, res) => {
  try {
    const { po_id, prID, prNum, rejectRemarks, userId } = req.query;

    const Reject_Remarks = await PO_REJECT.create({
      pr_id: prID,
      po_id: po_id,
      remarks: rejectRemarks,
      masterlist_id: userId,
    });

    if (Reject_Remarks) {
      const PR_newData = await PR_PO.update(
        {
          status: "Rejected",
        },
        {
          where: { po_id: po_id },
        }
      );

      if (PR_newData) {
        const PR_historical = await PR_history.create({
          pr_id: prID,
          status: "Rejected",
          remarks: `Purchase Order no. ${po_id} has been Rejected with pr number ${prNum}`,
        });
        if (PR_historical) {
          await Activity_Log.create({
            masterlist_id: userId,
            action_taken: `Purchase Order no. ${po_id} has been Rejected with pr number ${prNum}`,
          });

          res.status(200).json();
        }
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/approve").post(async (req, res) => {
  try {
    const { id, userId } = req.query;

    const manilaTimezone = "Asia/Manila";
    moment.tz.setDefault(manilaTimezone);

    // Get the current datetime in Manila timezone
    const currentDateTimeInManila = moment();
    const PR_newData = await PR.update(
      {
        status: "For-Canvassing",
        date_approved: currentDateTimeInManila.format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        where: { id: id },
      }
    );

    const PR_historical = await PR_history.create({
      pr_id: id,
      status: "For-Canvassing",
    });

    if (PR_historical) {
      const forPR = await PR.findOne({
        where: {
          id: id,
        },
      });

      const PRnum = forPR.pr_num;

      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Purchase Request has been Approved with pr number ${PRnum}`,
      });
    }

    res.status(200).json();
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/update").post(async (req, res) => {
  try {
    const { id, prNum, dateNeed, useFor, remarks, addProductbackend } =
      req.query;

    const PR_newData = await PR.update(
      {
        pr_num: prNum,
        date_needed: dateNeed,
        used_for: useFor,
        remarks: remarks,
        status: "For-Approval",
      },
      {
        where: { id: req.query.id },
      }
    );
    const updatedID = PR_newData.id;

    //  return console.log(id)

    if (!Array.isArray(addProductbackend)) {
      return res.status(200).json();
    } else {
      //for update product
      const deletePR_prod = PR_product.destroy({
        where: {
          pr_id: id,
        },
      });

      if (deletePR_prod) {
        for (const prod of addProductbackend) {
          const prod_value = prod.value;
          const prod_quantity = prod.quantity;
          const prod_desc = prod.desc;
          const prod_type = prod.type;

          if (prod_type === "Product") {
            await PR_product.create({
              pr_id: id,
              product_id: prod_value,
              quantity: prod_quantity,
              description: prod_desc,
            });
          }
        }
      }

      //for update assembly

      const deletePR_assmbly = PR_assembly.destroy({
        where: {
          pr_id: id,
        },
      });
      if (deletePR_assmbly) {
        for (const prod of addProductbackend) {
          const prod_value = prod.value;
          const prod_quantity = prod.quantity;
          const prod_desc = prod.desc;
          const prod_type = prod.type;

          if (prod_type === "Assembly") {
            await PR_assembly.create({
              pr_id: id,
              assembly_id: prod_value,
              quantity: prod_quantity,
              description: prod_desc,
            });
          }
        }
      }

      //for update sparePart

      const deletePR_spare = PR_sparePart.destroy({
        where: {
          pr_id: id,
        },
      });
      if (deletePR_spare) {
        for (const prod of addProductbackend) {
          const prod_value = prod.value;
          const prod_quantity = prod.quantity;
          const prod_desc = prod.desc;
          const prod_type = prod.type;

          if (prod_type === "Spare") {
            await PR_sparePart.create({
              pr_id: id,
              spare_id: prod_value,
              quantity: prod_quantity,
              description: prod_desc,
            });
          }
        }
      }

      //for update subPart

      const deletePR_subpart = PR_subPart.destroy({
        where: {
          pr_id: id,
        },
      });
      if (deletePR_subpart) {
        for (const prod of addProductbackend) {
          const prod_value = prod.value;
          const prod_quantity = prod.quantity;
          const prod_desc = prod.desc;
          const prod_type = prod.type;

          if (prod_type === "SubPart") {
            await PR_subPart.create({
              pr_id: id,
              subPart_id: prod_value,
              quantity: prod_quantity,
              description: prod_desc,
            });
          }
        }
      }
    }

    res.status(200).json();
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/cancel").put(async (req, res) => {
  try {
    const { row_id, userId } = req.body;

    const [affectedRows] = await PR.update(
      {
        status: "Cancelled",
      },
      {
        where: { id: row_id },
      }
    );

    const PRnum = await PR.findOne({
      where: {
        id: row_id,
        status: "Cancelled",
      },
    });

    const prnumber = PRnum.pr_num;

    const PR_historical = await PR_history.create({
      pr_id: row_id,
      status: "Cancelled",
    });

    if (PR_historical) {
      await Activity_Log.create({
        masterlist_id: userId,
        action_taken: `Purchase Request has been cancelled with pr number ${prnumber}`,
      });
    }

    res.status(200).json();
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

router.route("/cancel_PO").put(async (req, res) => {
  try {
    const { row_id, userId } = req.body;

    const [affectedRows] = await PR.update(
      {
        status: "For-Canvassing",
      },
      {
        where: { id: row_id },
      }
    );

    const findPr = await PR.findOne({
      where: {
        id: row_id,
      },
    });

    const prnumber = findPr.pr_num;

    await Activity_Log.create({
      masterlist_id: userId,
      action_taken: `Purchase Order has been re-canvassed with pr number ${prnumber}`,
    });

    const PR_historical = await PR_history.create({
      pr_id: row_id,
      status: "For-Canvassing",
      remarks: "For-Approval (PO) - Re Canvassing",
    });

    await PR_PO.destroy({
      where: {
        pr_id: row_id,
      },
    });

    await PR_PO_asmbly.destroy({
      where: {
        pr_id: row_id,
      },
    });

    await PR_PO_spare.destroy({
      where: {
        pr_id: row_id,
      },
    });

    await PR_PO_subpart.destroy({
      where: {
        pr_id: row_id,
      },
    });

    res.status(200).json();
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
