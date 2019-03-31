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

  // all boards route
  boards.get("/all", (req, res) => {
    res.render("all_boards")
  });


  // get from create form
  boards.get("/create", (req, res) => {
    const currentUser = req.session.userid;
    knex
    .select('*')
    .from('users')
    .then(function(results){
      const cookie = results[0][0]
      const boards = results[1]
      const templateVars = {
      id: req.session.userid,
      boards : boards}
      // res.json(boards);
      res.render("create_board", templateVars);
      })
    });

  // post to database and redirect to /users/boards
  // boards.post("/create", (req, res) => {
  //   if (!req.body) {
  //     res.status(400).json({error: 'invalid request: no data in POST body'});
  //     return;
  //   }
  //   const user_id = req.session.userid,
  //   link_id = req.params.linkid
  //   res.redirect("../users/:userID/boards");
  // })

  return boards;
}
