const express = require("express");
const jwt = require("jsonwebtoken");

//Secret keyword
const secret = "ttrpgAndBoardgames";

module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(data, secret, {});
};

//Token Verification
module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;
  console.log(token);

  if (token === undefined) {
    return res.send("No token provided!");
  } else {
    token = token.slice(7, token.length);
    console.log(token);
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return res.send({
        auth: "Failed",
        message: err.message,
      });
    } else {
      console.log(decodedToken);

      req.user = decodedToken;
      console.log(req);
      next();
    }
  });
};

// Check if admin
module.exports.verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return res.send({
      auth: "Failed",
      message: "Action Forbidden!",
    });
  }
};
