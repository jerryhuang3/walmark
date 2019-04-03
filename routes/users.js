"use strict";

const express = require('express');
const users  = express.Router();

module.exports = (knex) => {

  users.get('/', (req, res) => {
    knex
      .select('id','username','full_name','email','avatar','create_date')
''      .from('users')
      .then((results) => {
        res.json(results);
    });
  });



  return users;
}
