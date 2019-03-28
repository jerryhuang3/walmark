"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Login
app.post("/login", (req, res) => {
  knex
  .select("*")
    .from("users")
    .then((results) => {
      for (let i = 0; i < results.length; i++) {
        if (req.body.email === results[i].email && req.body.password === results[i].password) {
          console.log("MATCH");
          return res.redirect("/");
        } else {
          res.status(403).send("HTTP 403 - NOT FOUND: E-MAIL OR PASSWORD INCORRECT!");
        }
      }
    });
});

// Register
app.post("/register", (req, res) => {
  knex
  .select("*")
    .from("users")
    .then((results) => {
    for (let i = 0; i < results.length; i++) {
      if (req.body.email === results[i].email) {
        return res.status(400).send("HTTP 400 - BAD REQUEST: E-MAIL ALREADY USED!");
      } else if (req.body.username === results[i].username) {
        return res.status(400).send("HTTP 400 - BAD REQUEST: USERNAME ALREADY USED!");
      } else {
        return res.redirect("/");
      }
    }
  });
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
