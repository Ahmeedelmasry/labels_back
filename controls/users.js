const UserSchema = require("../models/users");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { generToken } = require("./auth.js");

// Creation Validator
const validatCreation = (error, body) => {
  const errors = {};
  let mainMsg = null;

  if (error.code == 11000) {
    errors.email = "Email is already in use";
    mainMsg = "Email is already in use";
  }
  for (const val of Object.entries(error.errors ? error.errors : body)) {
    if (error.errors && error.errors[val[0]]) {
      if (!mainMsg) mainMsg = error.errors[val[0]].message;
      errors[val[0]] = error.errors[val[0]].message;
    }
  }

  return {
    errors: errors,
    message: mainMsg,
  };
};

// Create User
const setUser = async (req, res) => {
  let filepath;
  try {
    const salt = await bcrypt.genSalt();
    //Hash The Password
    const mailBody = {...req.body}
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const body = {
      ...req.body,
    };

    const set = await UserSchema.create(body);
    await set.save();

    return res.status(200).json({ message: "User Created Successfully" });
  } catch (error) {
    const errors = validatCreation(error, req.body);
    res.status(400).json({ errors: errors.errors, message: errors.message });
  }
};

const updateUser = async (req, res) => {
  try {
    let user = await UserSchema.findOne({ _id: req.params.id });
    //Hash The Password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const body = {
      ...req.body,
    };
    if (body.password) {
      const salt = await bcrypt.genSalt();

      //Hash The Password
      body.password = await bcrypt.hash(body.password, salt);
    }

    // Check If there is an image file uploaded
    let filepath;


    await UserSchema.updateOne({ _id: req.params.id }, body);

    const userData = {
      _id: req.params.id,
      ...body,
    };

    const cookie = generToken(userData);

    return res
      .status(200)
      .json({ token: cookie, message: "User updated successfully" });
  } catch (error) {
    const errors = validatCreation(error, req.body);
    res.status(400).json({ errors: errors.errors, message: errors.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await UserSchema.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }
};

// Get User
const getUser = async (req, res) => {
  try {
    const result = await UserSchema.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "User not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }
};

// Get User
const getUsers = async (req, res) => {
  try {
    let query = {};

    const { searchWord, page = 1, limit = 10 } = req.query;

    if (searchWord) {
      query = {
        $or: [
          { userName: { $regex: searchWord, $options: "i" } },
          { email: { $regex: searchWord, $options: "i" } },
        ],
      };
    }

    const options = {
      page: Number(page),
      limit: Number(limit),
      select: `userName email isActive createdAt`,
    };

    const result = await UserSchema.paginate(query, options);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

const getClients = async (req, res) => {
  try {
    let query = {};

    const { searchWord, page = 1, limit = 10 } = req.query;

    if (searchWord) {
      query = {
        $or: [
          { userName: { $regex: searchWord, $options: "i" } },
          { email: { $regex: searchWord, $options: "i" } },
        ],
      };
    }

    query.isAdmin = false;

    const options = {
      page: Number(page),
      limit: Number(limit),
      select: `userName email isActive isAdmin createdAt`,
    };

    const result = await UserSchema.paginate(query, options);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

module.exports = {
  setUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getClients,
};
