"use strict";

const express = require('express');
const ratings  = express.Router();

module.exports = (knex) => {
  // Create rating API
  ratings.get("/", (req, res) => {
    knex
    .select("*")
      .from("ratings")
      .then((results) => {
      res.json(results);
});
});

  // Adds or update's a user's rating of a link
  ratings.post('/' , (req, res) => {
    let linkID = req.body.linkID;
    let rating = parseInt(req.body.rating);
    let userID = req.session.userid;

    knex
      .select('*')
      .from('ratings')
      .where({user_id: userID, link_id: linkID})
      .then((ratings) => {
        if (!ratings[0]) {
          knex('ratings')
            .insert({ user_id: userID, link_id: linkID, rating: rating })
            .then(() => {
              return res.redirect(`/links/${linkID}`);
            });
        } else {
          knex('ratings')
            .where({ link_id: linkID, user_id: userID })
            .update('rating', rating)
            .then(() => {
              return res.redirect(`/links/${linkID}`);
            });
        };
      });
    });
  return ratings;
}
