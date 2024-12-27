const jwt = require("jsonwebtoken");
const {
  app: { COOKIE_SECRET },
} = require("./config");

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, user_name: user.user_name },
    COOKIE_SECRET,
    {
      expiresIn: "8h",
    }
  );
};
const verifyToken = (token) => {
  return jwt.verify(token, COOKIE_SECRET);
};

const authMiddleWare = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ status: "Unauthrized" });
  }
  try {
    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (err) {
    res.status(400).send({
      message: "Invalid token",
      status: 401,
      statusText: "Bad Request",
    });
  }
};

module.exports = { generateToken, verifyToken, authMiddleWare };
