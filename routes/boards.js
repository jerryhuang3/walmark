"use strict";

const express = require("express");
const boards = express.Router();

module.exports = knex => {
  // Boards API
  boards.get("/", (req, res) => {
    knex
      .select("*")
      .from("boards")
      .then(results => {
        res.json(results);
      });
  });

  // Create Board Page
  boards.get("/create", (req, res) => {
    const currentUser = req.session.userid;
    if (!currentUser) {
      res.redirect("back");
    } else {
      Promise.all([
        knex
          .select("*")
          .from("users")
          .where("id", req.session.userid),
        knex
          .select("title")
          .from("boards")
          .where("user_id", currentUser)
      ]).then(function(results) {
        const cookie = results[0][0];
        const boards = results[1];
        const templateVars = {
          id: req.session.userid,
          username: cookie.username,
          full_name: cookie.full_name,
          boards: boards
        };
        res.render("create_board", templateVars);
      });
    }
  });

  // Delete Boards
  boards.delete("/:boardID/delete", (req, res) => {
    const currentUser = req.session.userid;
    const boardID = req.params.boardID;
    knex
      .select("user_id")
      .from("boards")
      .where("id", boardID)
      .then(result => {
        if (currentUser != result[0].user_id) {
          res.status(400).send("Invalid request: This is not your board!");
        } else {
          knex("boards")
            .where({ id: boardID })
            .del()
            .then(result => {
              res.redirect("/");
            });
        }
      });
  });

  // Create board
  boards.post("/create", (req, res) => {
    if (!req.body) {
      res.status(400).json({ error: "invalid request: no data in POST body" });
      return;
    }
    const boardTitle = req.body.board_title;
    const userID = req.session.userid;
    knex
      .select("*")
      .from("boards")
      .then(function() {
        knex
          .insert({
            user_id: userID,
            title: boardTitle,
            create_date: knex.fn.now()
          })
          .returning("*")
          .into("boards")
          .then(function(result) {});
      });
    res.redirect(`/users/${userID}`);
  });

  // User boards
  boards.get("/:boardID", (req, res) => {
    const boardID = req.params.boardID;
    if (!req.session.userid) {
      res.redirect("/");
    }
    knex
      .select("username", "full_name", "id")
      .from("users")
      .where("id", req.session.userid)
      .then(function(results) {
        const user = results[0];
        knex
          .select("*")
          .from("boards")
          .join("users", { "boards.user_id": "users.id" })
          .where("boards.id", boardID)
          .then(function(results) {
            const boardInfo = results[0];
            knex
              .select("*")
              .from("boards_links")
              .join("boards", { "boards_links.board_id": "boards.id" })
              .join("users", { "boards.user_id": "users.id" })
              .join("links", { "boards_links.link_id": "links.id" })
              .join("topics", { "links.topic_id": "topics.id" })
              .where("board_id", boardID)
              .then(function(results) {
                const linkInfo = results;
                const templateVars = {
                  id: req.session.userid,
                  boardid: boardID,
                  linktitle: linkInfo.title,
                  linkid: linkInfo.link_id,
                  user_avatar: linkInfo.avatar,
                  url: linkInfo.url,
                  desc: linkInfo.description,
                  create_date: linkInfo.create_date,
                  boarduser: boardInfo.username,
                  boardtitle: boardInfo.title,
                  topic: linkInfo.name,
                  color: linkInfo.color,
                  links: linkInfo,
                  username: user.username,
                  full_name: user.full_name
                };
                res.render("user_board", templateVars);
              });
          });
      });
  });

  return boards;
};
