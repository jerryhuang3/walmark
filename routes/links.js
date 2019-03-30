"use strict";

const express = require('express');
const linksRoutes  = express.Router();
const LinkHelpers = require('../lib/link-helpers.js');
const cookieSession = require('cookie-session');
const cheerio = require('cheerio');
const request = require('request');

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
    if (!currentUser){
      res.redirect('back');
    } else {
      knex
      .select('*')
      .from('users')
      .where('id', req.session.userid)
      .then((userInfo) => {
        let templateVars = userInfo[0];
        res.render("create_link", templateVars);
      })
  }
})

  linksRoutes.post("/create", (req, res) => {
    if (!req.body) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    const topic = knex.select('id').from('topics').where('name',req.body.link_topic)
    const title = req.body.link_title
    const desc = req.body.link_desc
    const url = req.body.link_url
    const userid = req.session.userid
    knex
    .insert({user_id:userid, topic_id:topic, url:url, title:title, 
            description:desc, create_date:knex.fn.now()})
    .into('links').asCallback(function(err){
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
          console.log('YAY!');
          res.redirect('/');
      }
  });

      
})


//getting link page
  linksRoutes.get("/:linkId", (req, res) => {
    const linkId = req.params.linkId;
    const response =
      Promise.all([
        knex.select('*').from('links')
          .join('users',{'links.user_id' : 'users.id'})
          .where('links.id',linkId),
        knex.select('username','full_name')
            .from('users')
            .where('id', req.session.userid)])
                .then(function(results){
                  const links = results[0][0];
                  const cookie = results[1][0];
                  const vartemplate = {
                    id: req.session.userid,
                    title: links.title,
                    fullname: links.full_name,
                    user_avatar: links.avatar,
                    url: links.url,
                    desc: links.description,
                    create_date: links.create_date,
                    link_id:linkId,
                    username:cookie.username,
                    full_name: cookie.full_name,
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
