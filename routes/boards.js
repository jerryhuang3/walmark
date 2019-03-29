"use strict";

const express = require('express');
const boards  = express.Router();

module.exports = (knex) => {

  boards.get("/", (req, res) => {
    knex
    .select("*")
      .from("boards")
      .then((results) => {
      res.json(results);
});
});

  return boards;
}
