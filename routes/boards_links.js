"use strict";

const express = require("express");
const boardsLinks = express.Router();

module.exports = knex => {
  boardsLinks.get("/", (req, res) => {
    knex
      .select("*")
      .from("boards_links")
      .join("boards", { "boards_links.board_id": "boards.id" })
      .join("links", { "boards_links.link_id": "links.id" })
      .join("topics", { "links.topic_id": "topics.id" })
      .then(function(results) {
        res.json(results);
      });
  });

  return boardsLinks;
};
