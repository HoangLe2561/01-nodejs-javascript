const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const createUserService = async (name, email, password) => {
  try {
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

module.exports = {
  createUserService,
};
