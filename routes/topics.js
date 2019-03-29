"use strict";

const express = require('express');
const topics  = express.Router();

module.exports = (knex) => {

  topics.get("/", (req, res) => {
    knex
    .select("*")
      .from("topics")
      .then((results) => {
      res.json(results);
});
});

  return topics;
}
