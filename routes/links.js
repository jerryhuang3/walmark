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

  linksRoutes.get("/create", (req, res) => {
    const currentUser = req.session.userid;
    const templateVars = { id : currentUser};
    if (!currentUser){
      res.redirect('back');
    } else {

    res.render("create-link", templateVars);
  }
  })



//getting comments
  linksRoutes.get("/:linkId", (req, res) => {
    const linkId = req.params.linkId;
    const response =
      knex.select('*').from('links')
          .join('users',{'links.user_id' : 'users.id'})
          .where('links.id',linkId)
                .then(function(results){
                  const links = results[0];
                  console.log(results[0]);
                  const vartemplate = {
                    id: req.session.userid,
                    title: links.title,
                    full_name: links.full_name,
                    user_avatar: links.avatar,
                    url: links.url,
                    desc: links.description,
                    create_date: links.create_date,
                    link_id:linkId,
                    username:links.username
                  }
                    res.render('link', vartemplate);
  });
});

  //displaying comments on one link
  linksRoutes.get("/:linkId/comments", (req, res) => {
    const linkId = req.params.linkId;
    knex.select('*', 'comments.create_date as create_date').from('comments')
          .join('users',{'comments.user_id' : 'users.id'})
          .where('comments.link_id',linkId)
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
      const user_id = req.session.userid,
        link_id = req.params.linkId,
        text = req.body.text,
        like_count = 0
      knex.insert([{user_id: user_id, link_id: link_id, text: text, create_date: knex.fn.now()}])
          .into('comments').asCallback(function(err){
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
                console.log('YAY!');
                res.redirect('back');
            }
        });
  })


  return linksRoutes;
}
