"use strict";

const express = require('express');
const profileRoutes  = express.Router();

module.exports = (knex) => {

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
        console.log(results);
        const links = results
        const templateVars = {
        id: req.session.userid,
        title: links.title,
        full_name: links.full_name,
        user_avatar: links.avatar,
        url: links.url,
        desc: links.description,
        create_date: links.create_date,
        username: links.username,
        linktitle: links.linktitle,
        topic: links.name,
        links: links
        }
        console.log(templateVars);
      res.render('user_board', templateVars);
        })
    });

// Create board
profileRoutes.get("/:userID/board", (req, res) => {
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
      res.render("create_board", templateVars);
      })
    }
  });

// Route for creating a board
profileRoutes.post("/:userID/board", (req, res) => {
  console.log(req.body)
})

// Route for updating boards
profileRoutes.put("/:userID/board/:boardID/update", (req, res) => {

})


  return profileRoutes;
}
