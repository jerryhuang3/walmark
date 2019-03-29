"use strict";

const express = require('express');
const profileRoutes  = express.Router();

module.exports = (knex) => {

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

  return profileRoutes;
}
