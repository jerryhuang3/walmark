"use strict";

const express = require('express');
const boards  = express.Router();

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

  // all boards route
  boards.get("/all", (req, res) => {
    res.render("all_boards")
  });


  // get from create form
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

  // post to database and redirect to /users/boards
  boards.post("/create", (req, res) => {
    if (!req.body) {
      res.status(400).json({error: 'invalid request: no data in POST body'});
      return;
    }
    res.redirect("/boards");
  })

  return boards;
}
