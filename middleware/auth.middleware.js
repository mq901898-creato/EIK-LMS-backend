const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Get token from request header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // Format: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save user data in request
    req.user = decoded;

    // Continue to next middleware/controller
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = auth;