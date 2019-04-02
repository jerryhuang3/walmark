"use strict";

const express = require('express');
const boards  = express.Router();
const cookieSession = require('cookie-session');

module.exports = (knex) => {

  // boards api
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
