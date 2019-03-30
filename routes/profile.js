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

  return profileRoutes;
}
