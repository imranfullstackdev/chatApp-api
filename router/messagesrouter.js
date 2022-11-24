


const express = require("express");
const messageSchema = require("../Schema/messageSchema");
const router = express.Router();

router.post("/addMessages", async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const data = await messageSchema.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.json({ msg: "Messages Added Sucessfully" });
    } else {
      return res.json({ msg: "Error in Adding Messages" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/addAllMessages", async (req, res) => {
  try {
    const { from, to } = req.body;
    const messages = await messageSchema
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectMessages);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
