const express = require("express");
const router = express.Router();
const user = require("../Schema/userSchema");
const bcrypt = require("bcrypt");

// for posting the data
router.post("/adduser", async (req, res) => {
  const aUser = await user.find({ name: req.body.name, email: req.body.email });
  if (aUser.length > 0) {
    res.status(400).send({
      status: "fail",
      message: "User already Exist",
    });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashpassed = await bcrypt.hash(req.body.Password, salt);
    const addUser = new user({
      name: req.body.name,
      email: req.body.email,
      Password: hashpassed,
    });
    addUser.save();
    console.log(addUser);
    if (addUser) {
      res.send({
        status: true,
        message: "User Added Sucessfully",
        addUser,
      });
    }
  }
});

// for login
router.post("/login", async (req, res) => {
  const loginuser = await user.find({ email: req.body.email });
  if (loginuser.length > 0) {
    const verifyPassword = await bcrypt.compare(
      req.body.Password,
      loginuser[0].Password
    );
    console.log(verifyPassword);
    if (verifyPassword) {
      res.send(loginuser);
      console.log("login", loginuser);
    } else if (!verifyPassword) {
      res.status(400).send({
        status: "false",
        err: "Invalid Credential",
      });
    }
  } else {
    res.status(400).send({
      status: "false",
      message: "Invalid credetial",
    });
  }
});

// for posting avatar
router.post("/avatar/:id", async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const avatarImges = req.body.image;

  const avatarImg = await user.findByIdAndUpdate(
    id,
    {
      isAvatarImageSet: true,

      avatarImage: avatarImges,
    },
    { upsert: true }
  );
  console.log("avatara",avatarImg);
  if (avatarImg) {
    res.json({
      ...avatarImg,
      isSet: avatarImg.isAvatarImageSet,
      image: avatarImg.avatarImage,
    });
    console.log(avatarImg);
  }
});
// geting all routes

router.get("/allChats/:id", async (req, res) => {
  const { id } = req.params;
  const allChats = await user
    .find({ id: id })
    .select(["email", "name", "avatarImage", "_id"]);
  res.send({ allChats });
});

module.exports = router;
