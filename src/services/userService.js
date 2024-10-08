require("dotenv").config;
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { use } = require("../routes/api");

const saltRounds = 10;

const createUserService = async (name, email, password) => {
  try {
    //check user exists
    const user = await User.findOne({ email });
    if (user) {
      console.log("User exists. Try again.");
      return null;
    }

    //hash password
    const hashpassword = await bcrypt.hash(password, saltRounds);
    //save user to database
    let result = await User.create({
      name: name,
      email: email,
      password: hashpassword,
      role: "1",
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const loginService = async (email, password) => {
  try {
    // fetch user by email
    const user = await User.findOne({ email: email });
    if (user) {
      //compare password
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: "Email/Password Invalid",
        };
      } else {
        //create an access token
        const payload = {
          email: user.email,
          name: user.name,
        };
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });
        return {
          EC: 0,
          access_token,
          user: {
            email: user.email,
            name: user.name,
          },
        };
      }
    } else {
      return {
        EC: 1,
        EM: "Email/Password Invalid",
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
const getUserService = async () => {
  try {
    //save user to database
    let result = await User.find({}).select("-password");
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
module.exports = {
  createUserService,
  loginService,
  getUserService,
};
