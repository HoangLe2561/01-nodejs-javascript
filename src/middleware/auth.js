const jwt = require("jsonwebtoken");
require("dotenv").config;
const auth = (req, res, next) => {
  setTimeout(() => {
    const white_lists = ["/", "/login", "/register"];
    console.log(req.originalUrl);
    if (white_lists.find((item) => "/v1/api" + item === req.originalUrl)) {
      next();
    } else {
      if (req?.headers?.authorization?.split(" ")?.[1]) {
        const token = req.headers.authorization.split(" ")[1];

        // verify
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = {
            email: decoded.email,
            name: decoded.name,
            createdBy: "Hoang",
          };
          next();
        } catch (error) {
          return res.status(401).json({
            message: "Token is expired/invalid.",
          });
        }
      } else {
        //return exception
        return res.status(401).json({
          message:
            "You haven't transmitted Access Token in the header/ Token is expired.",
        });
      }
    }
  }, 3000);
};
module.exports = auth;
