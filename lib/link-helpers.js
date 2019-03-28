"use strict";

module.exports = function makeDataHelpers(db) {
  return {

    getTweets: function(callback) {
        const extract = knex.select('*').from('links')
                            .join('users',{'links.user_id' : 'users.id'})
                            .where('links.id',linkID)
                            .then(function(results){
                              let links = results[0];
                              callback(links);
                            })
                        },


      };
  };
  