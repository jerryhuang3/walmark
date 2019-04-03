"use strict";

const express = require('express');
const search  = express.Router();

module.exports = (knex) => {

  // Route rendering the search page once a search is submitted
  search.get('/', (req, res) => {
    if (req.session.userid) {
    knex
      .select('*')
      .from('users')
      .where('id', req.session.userid)
      .then((userInfo) => {
        let templateVars = userInfo[0];
        return res.render('search', templateVars);
      });
    } else {
      let templateVars = { id: req.session.userid };
      res.render('search', templateVars);
    }
});


// Route returning search results from AJAX request
  search.get('/:searchQuery', (req, res) => {
    let searches = req.params.searchQuery;
    knex
      .select('links.id', 'title')
      .from('links')
      .join('topics', {'topics.id' : 'links.topic_id'})
      .where('title', 'LIKE', `%${searches}%`)
      .orWhere('description', 'LIKE', `%${searches}%`)
      .orWhere('name', 'LIKE', `%${searches}%`)
      .then((results) => {
        res.json(results);
      });
  });

  return search;
}
