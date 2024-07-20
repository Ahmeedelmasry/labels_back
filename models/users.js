const mongoose = require("mongoose");
const { isEmail } = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please enter user name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email address"],
    unique: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  isActive: {
    type: Boolean,
    required: [true, "Please enter user active status"],
    default: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("users", UserSchema);
