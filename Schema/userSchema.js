const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
    min: 3,
  },
  email: {
    type: "string",
    required: true,
  },
  Password: {
    type: "string",
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
});
module.exports=mongoose.model('users',userSchema)
