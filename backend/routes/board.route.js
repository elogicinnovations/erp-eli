const router = require("express").Router();
const { where, Op, fn, col } = require("sequelize");
const sequelize = require("../db/config/sequelize.config");
const { MasterList, Board, Board_to, Board_pic, Board_reply } = require("../db/models/associations");
const session = require("express-session");

router.route("/fetchmasterlist").get(async (req, res) => {
  try {
    const data = await MasterList.findAll({
      where: {
        user_type: "Standard User",
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

router.route("/post").post(async (req, res) => {
  const { selectedtoSend, subject, message, userId, productImages } = req.body;

  const insert = await Board.create({
    subject: subject,
    postBy: userId,
    message: message,
  });

  if (insert) {
    selectedtoSend.forEach(async (data) => {
      await Board_to.create({
        board_id: insert.id,
        user_to: data.col_id,
      });
    });

    if (productImages && productImages.length > 0) {
      productImages.forEach(async (i) => {
        await Board_pic.create({
          board_id: insert.id,
          image: i.image,
        });
      });
    }
  }

  return res.json().status(200);
});

router.route("/fetchPostReply").get(async (req, res) => {
  const {board_id} = req.query
  console.log(`board_id ${board_id}`)
  try {
    const data = await Board_reply.findAll({
      where:{
        board_id: board_id
      },
      include:[{
        model: MasterList,
        as: "replyfrom", 
        attributes: ["col_Fname"],
        foreignKey: "reply_by",
        required: true,
      }]
    })

    if (data){
      // console.log(data)
      return res.json(data)
    }
  } catch (err) {
      console.error(err);
      res.status(500).json("Error");
    }
})


router.route("/fetchPost").get(async (req, res) => {
    try {
        // Fetch data from all three tables
        const boards = await Board.findAll({
            include: [ {
                model: MasterList,
                as: "postby", 
                attributes: ["col_Fname"],
                foreignKey: "postBy",
                required: true,
              },],
              order: [['createdAt', 'DESC']]
        });
        const boardPics = await Board_pic.findAll();
        const boardTos = await Board_to.findAll();

        // Create a map of board id to pictures and to's
        const picMap = boardPics.reduce((acc, pic) => {
            acc[pic.board_id] = acc[pic.board_id] || [];
            acc[pic.board_id].push(pic);
            return acc;
        }, {});

        const toMap = boardTos.reduce((acc, to) => {
            acc[to.board_id] = acc[to.board_id] || [];
            acc[to.board_id].push(to);
            return acc;
        }, {});

        // Combine the data
        const data = boards.map(board => ({
            ...board.dataValues,
            pictures: picMap[board.id] || [],
            tos: toMap[board.id] || []
        }));

        // Check if data exists and send the response
        if (data.length) {

            // console.log(data)
            return res.json(data);
        } else {
            return res.json(data);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json("Error");
    }
});

router.route("/fetchPostEdit").get(async (req, res) => {
  const {board_id} = req.query
  const data = await Board.findAll({
  where: {
    id: board_id
  }
});

if(data){
  return res.json(data)
}
})


router.route("/post_reply").post(async (req, res) => {
  const { reply, userId, board_idReply } = req.body;

  const insert = await Board_reply.create({
    board_id: board_idReply,
    reply_by : userId,
    message: reply,
  });

  if (insert) {
    return res.json().status(200);
  }

 
});




router.route("/updatePost").post(async (req, res) => {
  const { updateMessage,
    updateSubject,
    board_idReply, } = req.body;

  const insert = await Board.update({
    subject : updateSubject,
    message: updateMessage,
  },{
    where:{
      id: board_idReply
    }
  });

  if (insert) {
    return res.json().status(200);
  }

 
});



router.route("/deletePost").post(async (req, res) => {
  const { board_id } = req.body;



  const pic = await Board_pic.destroy({
    where:{
      board_id: board_id
    }
  })
  const reply = await Board_reply.destroy({
    where:{
      board_id: board_id
    }
  })

  const to = await Board_to.destroy({
    where:{
      board_id: board_id
    }
  })


  const insert = await Board.destroy({
    where:{
      id: board_id
    }
  });

  return res.json().status(200);

 
});

module.exports = router;
