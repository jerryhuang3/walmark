"use strict";

const express = require('express');
const boardsLinks  = express.Router();

module.exports = (knex) => {

  boardsLinks.get("/", (req, res) => {
    knex
    .select("*")
      .from("boards_links")
      .then((results) => {
      res.json(results);
});
});

  return boardsLinks;
}
