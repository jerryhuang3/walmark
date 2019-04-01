"use strict";

const express = require('express');
const profileRoutes  = express.Router();

module.exports = (knex) => {

// Create board page
profileRoutes.get("/:userID/board/create", (req, res) => {
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
        const cookie = results[0][0]
        const boards = results[1]
        const templateVars = {
        id: req.session.userid,
        username:cookie.username,
        full_name: cookie.full_name,
        boards : boards}
        // res.json(boards);
        res.render("create_board", templateVars);
        })
      }
  });

// Create board
profileRoutes.post("/:userID/board/create", (req, res) => {
  if(!req.body) {
    res.status(400).json({ error: 'invalid request: no data in POST body'});
    return;
  }
  // console.log(req.session.userid);
  const boardTitle = req.body.board_title;
  const userID = req.session.userid;
  knex.select('*').from('boards')
  .then(function(results) {
    knex.insert({user_id:userID, title:boardTitle, create_date:knex.fn.now()}).returning('*')
    .into('boards').then(function(result) {
      console.log(result)
    })
  })
  res.redirect('/users/:userID');
})

// User boards
profileRoutes.get("/:userID/board/:boardID", (req, res) => {
  const userID = req.params.userID;
  const boardID = req.params.boardID;
  const response =
    knex.select('*', 'links.title as linktitle').from('links')
      .join('boards',{'links.user_id' : 'boards.user_id'})
      .join('users', {'links.user_id' : 'users.id'})
      .join('topics', {'links.topic_id' : 'topics.id'})
      .where('boards.id',boardID)
      .then(function(results){
        const links = results
        const templateVars = {
        id: req.session.userid,
        boardtitle: links.title,
        full_name: links.full_name,
        user_avatar: links.avatar,
        url: links.url,
        desc: links.description,
        create_date: links.create_date,
        username: links.username,
        linktitle: links.linktitle,
        topic: links.name,
        color: links.color,
        links: links
        }
      res.render('user_board', templateVars);
        })
    });

  return profileRoutes;
}
