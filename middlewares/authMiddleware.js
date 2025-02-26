const JWT = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authentication token is missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1]; // Extract the token after 'Bearer'
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: "Authentication Failed: Invalid token",
        });
      } else {
        req.body.userId = decode.userId; // Attach decoded userId to the request
        next(); // Proceed to the next middleware/handler
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(401).send({
      success: false,
      error,
      message: "Authentication Failed: An error occurred",
    });
  }
};

module.exports = authMiddleware;
