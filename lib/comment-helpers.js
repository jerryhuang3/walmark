"use strict";

// Defines helper functions for saving and getting comments, using the database `db`
module.exports = function makeDataHelpers(knex) {
  return {
          // Saves a comment to db
    saveComment: function(newComment, callback) {
        knex.insert(newComment)
            .into('comments');
        callback(null, true);
    },

    // Get all comments in db, sorted by newest first
    getComments: function(callback) {
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        const extract = db.collection("tweets").find().toArray((err, results) => {
          if (err) throw err;
          results.sort(sortNewestFirst);
          callback(null, results);
        });
     }
    }
}