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

// User board page when viewing a board
profileRoutes.get("/:userID/boards/:boardID", (req, res) => {
  const boardID = req.params.boardID;
  knex.select('*', 'links.title as linktitle', 'links.id as linkid').from('links')
        .join('users',{'links.user_id' : 'users.id'})
        .join('boards',{'links.user_id' : 'boards.user_id'})
        .join('topics',{'links.topic_id' : 'topics.id'})
        .where('boards.id', boardID)
        .then(function(results){
          const boards = results[0];
          const vartemplate = {
            id: req.session.userid,
            title: boards.title,
            full_name: boards.full_name,
            user_avatar: boards.avatar,
            url: boards.url,
            description: boards.description,
            linktitle: boards.linktitle,
            create_date: boards.create_date,
            username: boards.username,
            topic: boards.name
          }
    res.render('user_board', vartemplate);
  });
});

// User page showing all user boards
profileRoutes.get("/:userID/boards/", (req, res) => {
  res.render('all_user_board');
});

  return profileRoutes;
}
