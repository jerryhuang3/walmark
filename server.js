"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const cookies     = require('cookie-session');
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const linksRoutes = require("./routes/links");
const profileRoutes = require("./routes/profile");

// Encrypting user sessions
app.use(cookies({
  name: "session",
  keys: ["secretkey"]
}));

// Generates 8 digit unique id
function generateRandomString() {
  let shortLink = Math.random().toString(36).substr(2, 8);
  return shortLink;
};

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
app.use("/links", linksRoutes(knex));
app.use("/users", profileRoutes(knex));

// Home page
app.get("/", (req, res) => {
  let templateVars = {session: req.session.userid};
  res.render("index", templateVars);
});

// Login
app.post("/login", (req, res) => {
  knex
  .select("*")
    .from("users")
    .then((results) => {
      for (let i = 0; i < results.length; i++) {
        if (req.body.username === results[i].username && req.body.password === results[i].password) {
          req.session.userid = req.body.username;
          console.log("MATCH");
          return res.redirect("/");
        }
      }
      return res.status(403).send("HTTP 403 - NOT FOUND: E-MAIL OR PASSWORD INCORRECT!").end();
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
        return res.status(400).send("HTTP 400 - BAD REQUEST: E-MAIL ALREADY USED!").end();
      } else if (req.body.username === results[i].username) {
        return res.status(400).send("HTTP 400 - BAD REQUEST: USERNAME ALREADY USED!").end();
      }
    }
    knex("users")
      .insert({ full_name: req.body.fullName, username: req.body.username, email: req.body.email, password: req.body.password })
      .then( function (result) {
        res.json({ success: true, message: 'ok' });     // respond back to request
      });
    req.session.userid = req.body.username;
    });
  return res.redirect("/");
});

// Clears cookies upon logging out
app.post("/logout", (req, res) => {
  req.session = null;
  return res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
