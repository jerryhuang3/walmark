"use strict";

const express = require('express');
const profileRoutes  = express.Router();

module.exports = (knex) => {
//
//   profileRoutes.get("/:userid", (req, res) => {
//     const userID = req.params.userID;
//     knex
//       .select('*')
//       .from('users')
//       .where({id = userID})
//       .then(function(results){
//         let users = results[0];
//         console.log(results);
//       res.render('account_page', {
//         full_name: users.full_name,
//         user_avatar: users.avatar,
//         email: users.email,
//         id: req.session.userid,
//         username: users.username
//     });
//   });
// });

// User boards
profileRoutes.get("/:userID/boards/:boardID", (req, res) => {
  const userID = req.params.userID;
  const boardID = req.params.boardID;
  const response =
    knex.select('*').from('links')
          .join('users',{'links.user_id' : 'users.id'})
          .join('boards',{'links.user_id' : 'boards.user_id'})
          .join('topics',{'links.topic_id' : 'topics.id'})
          .then(function(results){
            const boards = results[0];
            console.log(boards);
            const vartemplate = {
              id: req.session.userid,
              title: boards.title,
              full_name: boards.full_name,
              user_avatar: boards.avatar,
              url: boards.url,
              description: boards.description,
              create_date: boards.create_date,
              username: boards.username,
              boardtitle: boards.boardtitle,
              topic: boards.name
            }
      res.render('user_board', vartemplate);
  });
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
      // res.json(boards);
      res.render("create_board", templateVars);
      })
    }
  });


  return profileRoutes;
}
