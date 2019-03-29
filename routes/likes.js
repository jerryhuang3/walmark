"use strict";

const express = require('express');
const likes  = express.Router();

module.exports = (knex) => {

  likes.get("/", (req, res) => {
    knex
    .select("*")
      .from("likes")
      .then((results) => {
      res.json(results);
});
});

  return likes;
}
