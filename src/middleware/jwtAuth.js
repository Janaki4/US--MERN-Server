const jwt = require("jsonwebtoken");

require("dotenv/config");
const ErrorResponse = require("../response/errorResponse");

const auth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token)
      return res
        .status(400)
        .json(
          new ErrorResponse(
            "No token available, You are not authenticated.Please login again"
          )
        );
    const authToken = token.split(" ")[1];
    const data = jwt.verify(authToken, process.env.SECRET_KEY);

    req.data = data;
    req.body = req.body;
    next();
  } catch (error) {
    res.status(500).json(ErrorResponse(error));
  }
};

module.exports = { auth };
