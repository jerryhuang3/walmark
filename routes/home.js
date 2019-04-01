"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  // Creates an API of all links in api/links
  router.get("/", (req, res) => {
    knex
    .select("*")
      .from("links")
      .then((results) => {
      res.json(results);
      });
  });

  return router;
}
