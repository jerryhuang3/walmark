"use strict";

const express = require('express');
const profileRoutes  = express.Router();

module.exports = (knex) => {

  // profile page
profileRoutes.get("/:userID", (req, res) => {
  const userID = req.params.userID;
  const result = knex.select('*').from('users')
                    .then(function(results){
                      console.log(results);
                       let users = results[0];
    res.render('account_page', {
      full_name: users.full_name,
      user_avatar: users.avatar,
      email: users.email,
      id: req.session.userid,
      username: users.username
    });
  });
});

profileRoutes.get("/:userID/boards/:boardID", (req, res) => {
  const userID = req.params.userID;
  const boardID = req.params.boardID;
  const response =
    knex.select('*').from('boards')
          .join('users',{'boards.user_id' : 'users.id'})
          .where('boards.id',boardID)
          .then(function(results){
            const boards = results[0];
            console.log(results[0]);
            const vartemplate = {
              id: req.session.userid,
              title: boards.title,
              full_name: boards.full_name,
              user_avatar: boards.avatar,
              url: boards.url,
              desc: boards.description,
              create_date: boards.create_date,
              username:boards.username
            }
      res.render('user_board', vartemplate);
  });
});


  return profileRoutes;
}
