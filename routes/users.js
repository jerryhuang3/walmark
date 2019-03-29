"use strict";

const express = require('express');
const users  = express.Router();

module.exports = (knex) => {

  users.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  users.get("/users/:username", (res, req) => {

  })


  return users;
}
