"use strict";

const express = require('express');
const linksTopicsRoutes  = express.Router();

module.exports = (knex) => {

  linksTopicsRoutes.get("/", (req, res) => {
    knex.select('*', 'links.title as linktitle').from('links')
          .join('users',{'links.user_id' : 'users.id'})
          .join('boards',{'links.user_id' : 'boards.user_id'})
          .join('topics',{'links.topic_id' : 'topics.id'})
          .then(function(results) {
            res.json(results);
      });
  });

  return linksTopicsRoutes;
}

// this joins links and users (on user id) with boards (on user id)
// with topics (on topic id)
