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
    if (!currentUser){
      res.redirect('back');
    } else {
      Promise.all([
      knex
      .select('*')
      .from('users')
      .where('id', req.session.userid),
      knex.select('title').from('boards').where('user_id',currentUser)
      ])
    .then(function(results){
      const boards = results[1]
      const templateVars = {
      id: req.session.userid,
      username: results.username,
      full_name: results.full_name
    }
      // res.json(boards);
      res.render("create_board", templateVars);
      })
    }
  });

  return boards;
}
