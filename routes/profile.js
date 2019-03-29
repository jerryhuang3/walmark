"use strict";

const express = require('express');
const profileRoutes  = express.Router();

module.exports = (knex) => {

  profileRoutes.get("/:userID", (req, res) => {
    const userID = req.params.userID;
    const result = knex.select('*').from('users')
                      .then(function(results){
                         let users = results[0];
      res.render('account_page', {
        user: users.full_name,
        user_avatar: users.avatar,
        email: users.email,
        session: req.session.userID
    });
  });
});

  return profileRoutes;
}

let image = <img src="${user_avatar}" />
