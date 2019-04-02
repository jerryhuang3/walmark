$( document ).ready(function() {

  // Printing out board name on board page
  $.get('/api/userboards', function(allBoards) {
    let boardID = (window.location.pathname);
    boardID = boardID.replace(/\/boards\//, '').replace('/', '');
    for (let i = 0; i < allBoards.length; i++) {
      if (parseInt(boardID) === allBoards[i].id) {
        return $('h2').append(`${allBoards[i].title}`);
      }
    }
  });

});
