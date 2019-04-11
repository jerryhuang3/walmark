"use strict";

const express = require("express");
const userslinksRoutes = express.Router();

module.exports = knex => {
  // API getting all of a user's link's
  userslinksRoutes.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .join("links", "users.id", "=", "links.user_id")
      .where("user_id", req.session.userid)
      .then(function(results) {
        res.json(results);
      });
  });

  return userslinksRoutes;
};
