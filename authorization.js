require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json("User not authorized");
  }
  const toke = token.split(" ")[1];
  jwt.verify(toke, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    req.user = decoded.user;
    next();
  });
};
