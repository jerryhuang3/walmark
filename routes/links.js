"use strict";

const express = require('express');
const linksRoutes  = express.Router();

module.exports = (knex) => {

  linksRoutes.get("/", (req, res) => {
    knex
      .select('*')
      .from('links')
      .join('users',{'links.user_id' : 'users.id'})
      .where('links.id',1)
      .then((results) => {
        res.json(results)
    });
  });


  linksRoutes.get("/:linkID", (req, res) => {
    const linkID = req.params.linkID;
    const result = knex.select('*').from('links')
                       .join('users',{'links.user_id' : 'users.id'})
                       .where('links.id',linkID)
                       .then(function(results){
                         let links = results[0];
      res.render('link', {
        title: links.title,
        user: links.full_name,
        user_avatar: links.avatar,
        url: links.url,
        desc: links.description,
        create_date: links.create_date
    // const currentUser = req.session.user_ID;
    });
  });
});



  //displaying comments on one link
  linksRoutes.get("/:linkId/comments", (req, res) => {
    knex
        .select('*')
        .from('comments')
        .where('link_id',1)
        .then((results) => {
            res.json(results);
        });
  });

  //posting comment;
  linksRoutes.post("/:link_id/comments", (req, res) => {
    if (!req.body.text) {
        res.status(400).json({ error: 'invalid request: no data in POST body'});
        return;
      }
      const user = knex
        .select('id').from('users').where('username','test');
    //   const user = req.body.user ? req.body.user : UserHelpers.generateRandomUser();
      const link = knex
      .select('id').from('links').where('url','https://www.khanacademy.org/math');
      const comment = {
        user_id: user,
        link_id: link,
        content: {
          text: req.body.text
        },
        created_at: Date.now(),
        like_count: 0
      };
  
      DataHelpers.saveTweet(tweet, (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).send();
        }
      });
  
  })

  return linksRoutes;
}
