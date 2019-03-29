"use strict";

const express = require('express');
const linksRoutes  = express.Router();
const LinkHelpers = require('../lib/link-helpers.js');
const cookieSession = require('cookie-session');

module.exports = (knex) => {

  linksRoutes.get("/", (req, res) => {
    Promise.all([
      knex.select('*').from('links')
      .join('users',{'links.user_id' : 'users.id'})
      .where('links.id',1),
  knex.select('*').from('comments')
      .join('users',{'comments.user_id' : 'users.id'})
      .where('comments.link_id',1)
    ]).then((results) => {
        res.json(results)
    });
  });

//getting comments
  linksRoutes.get("/:linkId", (req, res) => {
    const linkId = req.params.linkId;
    const response = Promise.all([
      knex.select('*').from('links')
          .join('users',{'links.user_id' : 'users.id'})
          .where('links.id',linkId),
      knex.select('*').from('comments')
          .join('users',{'comments.user_id' : 'users.id'})
          .where('comments.link_id',linkId)])
                .then(function(results){
                  const links = results[0][0];
                  const comments = results[1][0];
                  const vartemplate = {
                    session: req.session.userid,
                    title: links.title,
                    user: links.full_name,
                    user_avatar: links.avatar,
                    url: links.url,
                    desc: links.description,
                    create_date: links.create_date,
                    comment_avatar: comments.avatar,
                    comment_name: comments.full_name,
                    comment_date: comments.create_date,
                    comment_text: comments.text,
                    link_id:linkId
                  }
                    res.render('link', vartemplate);
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
  linksRoutes.post("/:linkId/comment", (req, res) => {
    if (!req.body.text) {
        res.status(400).json({ error: 'invalid request: no data in POST body'});
        return;
      }
      const user_id = knex.select('id').from('users').where('username',req.session.userid),
        link_id = req.params.linkId,
        text = req.body.text,
        // created_at = Date.now(),
        like_count = 0
      knex.insert([{user_id: user_id, link_id: link_id, text: text, create_date: knex.fn.now()}])
          .into('comments').asCallback(function(err){
            if (err) { 
              res.status(500).json({ error: err.message });
            } else {
                console.log('YAY!');
                res.status(201).send();
            }
        });
  })

  return linksRoutes;
}
