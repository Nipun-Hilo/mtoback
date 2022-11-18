const jwt = require("jsonwebtoken");
const config = require("config");

exports.protect = function (req, res, next) {
  // Get token from header
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
  {   // Set token from header
     token = req.headers.authorization.split(" ")[1];
  }

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
};

