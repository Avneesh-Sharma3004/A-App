const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const { name, email, password } = req.body;

  const user = await userModel.create({
    name,
    email,
    password,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.status(201).json({
    message: "User created sucessfully",
    data: user,
    token: token,
  });
}

async function loginUser(req, res) {
    console.log("Login API Hit");
    console.log(req.body);
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
   
    if (!user) {
      return res.status(401).json({
        message: "Invalid Email",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Login Successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

module.exports = { registerUser, loginUser };
