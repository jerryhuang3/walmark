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

  boards.get("/create", (req, res) => {
    const currentUser = req.session.userid;
    if (!currentUser){
      res.redirect('back');
    } else {
      knex
      .select('*')
      .from('users')
      .then(function(results){
        res.render("create_board");
        })
      }
  });

  return boards;
}
