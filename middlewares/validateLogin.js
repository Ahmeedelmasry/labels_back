const { isEmail, isLength, isEmpty } = require("validator");

const validate = async (req, res, next) => {
  const { email, password } = req.body;
  if (isEmpty(email)) {
    return res.status(400).json({
      message: "Please enter your email",
    });
  }
  if (!isEmail(email)) {
    return res.status(400).json({
      message: "Please enter a valid email",
    });
  }

  // Validate password length
  if (isEmpty(password)) {
    return res.status(400).json({
      message: "Please enter your password",
    });
  }
  next();
};

module.exports = { validate };
