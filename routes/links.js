"use strict";

const express = require('express');
const linksRoutes  = express.Router();

// const getImage = function(url, cb){
//   request(url, function (error, response, html) {
//     if (!error && response.statusCode == 200) {
//       var $ = cheerio.load(html);
//       // console.log('html',html);
//       const imgs = $('img').toArray().map(e => {
//         return `http:${e.attribs.src}`
//       })
//       cb(imgs)
//     }
//   })
// }

module.exports = (knex) => {


  // linksRoutes.get("/try", (req, res) => {
  //   getImage("https://en.wikipedia.org/wiki/Plant", function(images) {
  //     res.json(images);
  //   })
  // })


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
        console.log(board,topic);
        knex.insert({user_id:userid, topic_id:topic, url:url, title:title,
            description:desc, create_date:knex.fn.now(), color:color}).returning('id')
    .into('links').then(function(result){
        const id = result[0];
        console.log(id);
         return knex.insert({link_id: id, board_id: board}).into('boards_links');
    }).asCallback(function(err){
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
          console.log('result',req.body.karenlau);
          res.redirect('/');
      }
      })
    })
  })
});

//getting link page
linksRoutes.get("/:linkId", (req, res) => {
  const linkId = req.params.linkId;
  const response =
    knex.select('*').from('links')
        .join('users',{'links.user_id' : 'users.id'})
        .where('links.id',linkId)
        .then(function(results){
          const links = results[0];
          knex.select('title').from('boards')
          .where('user_id',req.session.userid)
          .then(function(results){
            const boards = results
            const vartemplate = {
              id: req.session.userid,
              title: links.title,
              full_name: links.full_name,
              user_avatar: links.avatar,
              url: links.url,
              desc: links.description,
              create_date: links.create_date,
              link_id:linkId,
              username:links.username,
              boards: boards
            }
              res.render('link', vartemplate);
          })
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
      const cookie = results[0][0]
      const boards = results[1]
      const link = results[2][0]
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
      // res.json(results[0][0])
      })
    }
});

//getting comments
  linksRoutes.get("/:linkId", (req, res) => {
    const linkId = req.params.linkId;
  const response =
    knex.select('*').from('links')
      .join('users', { 'links.user_id': 'users.id' })
      .where('links.id', linkId)
      .then(function(results) {
        const links = results[0];
        const vartemplate = {
          id: req.session.userid,
          title: links.title,
          full_name: links.full_name,
          user_avatar: links.avatar,
          url: links.url,
          desc: links.description,
          create_date: links.create_date,
          link_id: linkId,
          username: links.username
        }
        res.render('link', vartemplate);
      });
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
        res.redirect(`/links/${link_id}`)
      })
    })

  })
//delete link
  linksRoutes.post("/:linkId/delete", (req, res) => {
    // console.log('heelooo');
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
        text = req.body.text,
        like_count = 0
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


  return linksRoutes;
}
