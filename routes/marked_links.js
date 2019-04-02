"use strict";

const express = require('express');
const markedLinks  = express.Router();

module.exports = (knex) => {

  markedLinks.get("/", (req, res) => {
    const currentUser = req.session.userid;
    knex.select('*').from('learnt_counters')
      .join('links',{'learnt_counters.link_id' : 'links.id'})
      .where({ userid: currentUser, learnt: 1})
      .then(function(results) {
        res.json(results);
      });
});

  return markedLinks;
}
