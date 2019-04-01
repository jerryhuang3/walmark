
$( document ).ready(function() {
  function loadBoards() {
    $.get('/api/userboards', function(allBoards) {
      renderBoards(allBoards);
    });
    $.get('/api/userlinks', function(allLinks) {
      renderLinks(allLinks);
    });

  };
  loadBoards();

  function renderBoards(boardLinks) {
    for (let i = 0; i < boardLinks.length; i++) {
      $("#boards-container").prepend(createBoards(boardLinks[i], (975 + i)));
    }
    let $grid = $('#boards-container').imagesLoaded(function() {
      $grid.masonry({
        itemSelector: '.boards',
        columnWidth: 100,
        horizontalOrder: true,
        percentPosition: true
      });
    });
  };

  function createBoards(boards, count) {

    return $boards = `
       <div class="boards">
           <img src="https://picsum.photos/300/400/?image=${count}">
          <h2>${boards.title}</h2>
          <h2>${boards.id}</h2>
          <h2>${boards.full_name}</h2>
          <h2>${boards.username}</h2>
       </div>`;
  };

  $( "#click1" ).click(function() {
    $('.boards').css('visibility', 'visible');
    $('.links').css('visibility', 'collapse');
    $('.saved').css('visibility', 'collapse');
  });

  $( "#click2" ).click(function() {
    $('.boards').css('visibility', 'collapse');
    $('.links').css('visibility', 'visible');
    $('.saved').css('visibility', 'collaspe');
  });

  $( "#click3" ).click(function() {
    $('.boards').css('visibility', 'collapse');
    $('.links').css('visibility', 'collapse');
    $('.saved').css('visibility', 'visible');
  });
});


