
$( document ).ready(function() {
  function loadBoards() {
    $.get('/api/userboards', function(allLinks) {
      renderBoards(allLinks);
    });
  };
  loadBoards();

  function renderBoards(boardLinks) {

    for (let i = 0; i < boardLinks.length; i++) {
      $("#boards-container").prepend(createBoards(boardLinks[i]));
    }
    let $grid = $('#boards-container').imagesLoaded(function() {
      $grid.masonry({
        itemSelector: '.boards',
        columnWidth: 100,
        horizontalOrder: true,
        percentPosition: true
      });
      // change size of item by toggling gigante class
      $grid.on('click', '.grid-item', function() {
        $(this).toggleClass('gigante');
        // trigger layout after item size changes
        $grid.masonry('layout');
      });

    });
  };

  function createBoards(boards) {

    return $boards = `
       <div class="boards">
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


