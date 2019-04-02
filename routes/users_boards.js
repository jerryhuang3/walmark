"use strict";

const express = require('express');
const usersboardRoutes  = express.Router();

module.exports = (knex) => {
  // API getting all of the walls belonging to a user
  usersboardRoutes.get("/", (req, res) => {
    knex.select('*')
      .from('users')
      .join('boards', 'users.id', '=', 'boards.user_id')
      .where('user_id',req.session.userid)
      .then(function(results) {
        res.json(results);
      });
  });

  return usersboardRoutes;
}
