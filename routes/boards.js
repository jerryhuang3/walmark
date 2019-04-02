"use strict";

const express = require('express');
const boards  = express.Router();

module.exports = (knex) => {

  // Boards API
  boards.get("/", (req, res) => {
    knex
    .select("*")
      .from("boards")
      .then((results) => {
      res.json(results);
    });
  });

  // Create Board Page
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
        const cookie = results[0][0];
        const boards = results[1];
        const templateVars = {
          id: req.session.userid,
          username: cookie.username,
          full_name: cookie.full_name,
          boards: boards
        }
        res.render("create_board", templateVars);
      })
  }
});

  // Delete Boards
  boards.post("/:boardID/delete", (req, res) => {
    const currentUser = req.session.userid;
    const boardID = req.params.boardID;
    knex.select('user_id')
      .from('boards')
      .where('id', boardID)
      .then((result) => {
        if(currentUser != result[0].user_id) {
          res.redirect('back');
        } else {
          knex('boards')
            .where({ id: boardID })
            .del()
            .then((result) => {
              res.redirect('/')
            });
        }
      })
  });


  // User boards
  boards.get("/:boardID", (req, res) => {
    const currentUser = req.session.userid;
    const boardID = req.params.boardID;
    if (!currentUser) {
      res.redirect('/');
    }
    knex.select('username', 'full_name').from('users').where('id', currentUser)
      .then(function(results) {
        const user = results[0];
        knex.select('*').from('boards_links')
          .join('boards',{'boards_links.board_id' : 'boards.id'})
          .join('users', {'boards.user_id' : 'users.id'})
          .join('links',{'boards_links.link_id' : 'links.id'})
          .join('topics', {'links.topic_id' : 'topics.id'})
          .where('board_id', boardID)
          .then(function(results) {
            const templateVars = {
              id: req.session.userid,
              boardid: boardID,
              linktitle: results.title,
              user_avatar: results.avatar,
              url: results.url,
              desc: results.description,
              create_date: results.create_date,
              linkuser: results.username,
              topic: results.name,
              color: results.color,
              links: results,
              username: user.username,
              full_name: user.full_name
            }
            res.render('user_board', templateVars);
          })
      })

});

  return boards;
}
