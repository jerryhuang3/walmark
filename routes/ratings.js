"use strict";

const express = require('express');
const ratings  = express.Router();

module.exports = (knex) => {

  ratings.get("/", (req, res) => {
    knex
    .select("*")
      .from("ratings")
      .then((results) => {
      res.json(results);
});
});

  return ratings;
}
