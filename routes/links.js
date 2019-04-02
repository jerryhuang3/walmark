"use strict";

const express = require('express');
const linksRoutes  = express.Router();

module.exports = (knex) => {

  linksRoutes.get("/create", (req, res) => {
    const currentUser = req.session.userid;
  if (!currentUser){
    res.redirect('back');
  } else {
    Promise.all([
      knex
        .select('*')
        .from('users')
        .where('id', req.session.userid),
      knex.select('title').from('boards').where('user_id',currentUser)
    ])
      .then(function(results){
        const cookie = results[0][0]
        const boards = results[1]
        const templateVars = {
          id: req.session.userid,
          username:cookie.username,
          full_name: cookie.full_name,
          boards : boards}
        // res.json(boards);
        res.render("create_link", templateVars);
      })
  }
});

//create link
  linksRoutes.post("/create", (req, res) => {
    if (!req.body) {
    res.status(400).json({ error: 'invalid request: no data in POST body'});
    return;
  }
  const title = req.body.link_title
  const desc = req.body.link_desc
  const url = req.body.link_url
  const userid = req.session.userid
  const color = req.body.link_color
  knex.select('id').from('topics').where('name',req.body.link_topic)
    .then(function(result){
      const topic = result[0].id;
      knex.select('id').from('boards').where('title',req.body.link_board)
        .then(function(result){
          const board = result[0].id;
          knex.insert({user_id:userid, topic_id:topic, url:url, title:title,
            description:desc, create_date:knex.fn.now(), color:color}).returning('id')
            .into('links').then(function(result){
            const id = result[0];
            knex.insert({link_id: id, userid: userid}).into('learnt_counters').then((result)=>{
              return knex.insert({link_id: id, board_id: board}).into('boards_links');
          }).asCallback(function(err){
              if (err) {
                res.status(500).json({ error: err.message });
              } else {
                console.log('YAY!');
                res.redirect(`/links/${id}/`);
              }
            })
          })
        })
    })
});

//getting link page
  linksRoutes.get("/:linkId", (req, res) => {
    const linkId = req.params.linkId;
  knex.select('*','links.create_date AS create_date').from('links')
    .join('users',{'links.user_id' : 'users.id'})
    .where('links.id',linkId)
    .then(function(results) {
      const links = results[0];
      knex.select('title').from('boards')
        .where('user_id', req.session.userid)
        .then(function(results) {
          const boards = results;
          knex('ratings').avg('rating')
            .where('link_id', linkId)
            .then(function(results) {
              const ratings = Math.round(10 * results[0].avg) / 10;
              knex.select('full_name').from('users').where({id: req.session.userid})
                .then(function(result){
                  const full_name = result[0].full_name;
                  knex.select('learnt').from('learnt_counters').where({ link_id: linkId, userid: req.session.userid })
                    .then(function(result) {
                      if (!result[0]){
                        const vartemplate = {
                          id: req.session.userid,
                          link_user: links.user_id,
                          title: links.title,
                          full_name: full_name,
                          link_name: links.full_name,
                          user_avatar: links.avatar,
                          url: links.url,
                          desc: links.description,
                          create_date: links.create_date,
                          link_id: linkId,
                          username: links.username,
                          boards: boards,
                          color: links.color,
                          avg_rating: ratings,
                          learnt: null
                        }
                        res.render('link', vartemplate);
                      } else {
                        const learnt = result[0].learnt;
                        const vartemplate = {
                          id: req.session.userid,
                          link_user: links.user_id,
                          link_name: links.full_name,
                          title: links.title,
                          full_name: full_name,
                          user_avatar: links.avatar,
                          url: links.url,
                          desc: links.description,
                          create_date: links.create_date,
                          link_id: linkId,
                          username: links.username,
                          boards: boards,
                          color: links.color,
                          avg_rating: ratings,
                          learnt: learnt
                        }
                        res.render('link', vartemplate);
                      }
                    })
                })
            })
        });
    });
});

//edit link
  linksRoutes.get("/:linkId/edit", (req, res) =>{
    const currentUser = req.session.userid;
  const link_id = req.params.linkId;
  if (!currentUser){
    res.redirect('back');
  } else {
    Promise.all([
      knex.select('*').from('users').where('id', req.session.userid),
      knex.select('title').from('boards').where('user_id',currentUser),
      knex.select('*').from('links').where('id', link_id)
    ])
      .then(function(results){
        const cookie = results[0][0];
        const boards = results[1];
        const link = results[2][0];
        const templateVars = {
          id: currentUser,
          link_id: link_id,
          username:cookie.username,
          full_name: cookie.full_name,
          boards : boards,
          link_title : link.title,
          link_desc : link.description,
          link_date : link.create_date}
        res.render("edit_link", templateVars);
      })
  }
});

  //submit edit
  linksRoutes.post("/:linkId/edit", (req, res) =>{
    const user = req.session.userid;
  const link_id = req.params.linkId;
  knex.select('id').from('topics').where('name',req.body.link_topic)
    .then((gettopic)=>{
    knex('links').where({id : link_id})
    .update({topic_id: gettopic[0].id, title: req.body.link_title, description: req.body.link_desc})
    .then((result)=>{
    res.redirect(`/links/${link_id}/`)
  })
})

})

//delete link
  linksRoutes.post("/:linkId/delete", (req, res) => {
    const currentUser = req.session.userid;
  const link_id = req.params.linkId;
  knex.select('user_id').from('links').where('id',link_id).then((result)=>{
    if (currentUser != result[0].user_id){
    res.redirect('back');
  } else {
    knex('links').where({id : link_id}).del().then( (result) => {
      res.redirect('/')
    })
  }
})
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
    text = req.body.text
  knex.insert({user_id: user_id, link_id: link_id, text: text, create_date: knex.fn.now()})
    .into('comments').asCallback(function(err){
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      console.log('YAY!');
      res.redirect('back');
    }
  });
})

  //saving link to own board
  linksRoutes.post("/:linkId/save", (req, res) => {
    const link_id = req.params.linkId;
  const board = req.body.selectme;
  knex.select('id').from('boards').where('title',board)
    .then((result)=> {
    knex.insert({link_id: link_id, board_id:result[0].id})
      .into('boards_links').asCallback(function(err){
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.redirect(`/links/${link_id}/`);
        }
      })
  })
})

  //marking link learnt
  linksRoutes.post("/:linkId/learnt", (req, res) => {
    const linkid = req.params.linkId;
  const userID = req.session.userid;
  knex.select('learnt').from('learnt_counters').where({link_id:linkid, userid:userID})
    .then((result)=>{
    if(result[0].learnt == 0){
    knex('learnt_counters').where({link_id:linkid, userid:userID})
      .increment('learnt',1).asCallback(function(err){
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.redirect(`/links/${linkid}/`);
      }
    })
  } else {
    knex('learnt_counters').where({link_id:linkid, userid:userID})
      .decrement('learnt',1).asCallback(function(err){
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.redirect(`/links/${linkid}/`);
      }
    })
  }
})
})

  return linksRoutes;
};
