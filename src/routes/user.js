const express = require("express");
const router = express.Router();

// Load required models
const User = require("../db/models/user");

// GET /api/users
const getUsers = (req, res, next) => {
  // Returns the currently authenticated user
  res.status(200);
  res.json(req.currentUser);
  return res.end();
};

// POST /api/users
const createUser = (req, res, next) => {
  // Creates a user
  const user = new User(req.body);

  user.save(err => {
    if (err) {
      err.status = 400;
      return next(err);
    }

    res.status(201);
    res.set("Location", "/");
    return res.end();
  });
};

module.exports.getUsers = getUsers;
module.exports.createUser = createUser;