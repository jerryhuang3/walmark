"use strict";

const express = require("express");
const comments = express.Router();

module.exports = knex => {
  comments.get("/", (req, res) => {
    knex
      .select("*")
      .from("comments")
      .then(results => {
        res.json(results);
      });
  });

  return comments;
};
