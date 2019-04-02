
$( document ).ready(function() {

  // Retrieving resource information
  function loadBoards() {
    $.get('/api/userboards', function(allBoards) {
      renderBoards(allBoards);
    });
    $.get('/api/userlinks', function(allLinks) {
      renderLinks(allLinks);
    });
  };
  loadBoards();

  // Load's all of a user's boards
  function renderBoards(usersBoards) {
    if (usersBoards[0] === undefined) {
      $boards = `
        <div class="create">
            <h2>You have no walls!</h2>
            <a class="button primary" href="/boards/create">Create New Wall</a>
        </div>`;
      return $("#boards-container").prepend($boards);
    };

    for (let i = 0; i < usersBoards.length; i++) {
      $("#boards-container").prepend(createBoards(usersBoards[i], (975 + i)));
    }

    let $grid = $('#boards-container').imagesLoaded(function() {
      $grid.masonry({
        itemSelector: '.boards',
        columnWidth: 200,
        horizontalOrder: true,
        percentPosition: true
      });
    });
  };

  function createBoards(boards, count) {
      return $boards = `
         <div class="boards">
            <img src="https://picsum.photos/400/400/?image=${count}">
            <a href="/boards/${boards.id}/"><div class="overlay-img"></div></a>
            <p>${boards.title}</p>
         </div>`;
  };

  // Loads all of a user's links
  function renderLinks(usersLinks) {
    if (usersLinks[0] === undefined) {
      $links = `
        <div class="create">
            <h2>You have no links!</h2>
            <a class="button primary" href="/links/create">Create New Link</a>
        </div>`;
      return $("#userlinks-container").append($links);
    };

    for (let i = 0; i < usersLinks.length; i++) {
      $("#userlinks-container").prepend(createLinks(usersLinks[i], (975 + i)));
    }
    let $grid = $('#userlinks-container').imagesLoaded(function() {
      $grid.masonry({
        itemSelector: '.links',
        columnWidth: '.links',
        horizontalOrder: true,
        percentPosition: true
      });
    });
  };

  function createLinks(links, count) {
    return $links = `
       <div class="links">
          <a href="/links/${links.id}/">
          <img src="https://picsum.photos/200/500/?image=${count}">
          </a>
          <p>${links.title}</p>
       </div>`;
  };



  $( "#click1" ).click(function() {
    $('#boards-container').css('visibility', 'visible');
    $('#userlinks-container').css('visibility', 'hidden');
  });

  $( "#click2" ).click(function() {
    $('#boards-container').css('visibility', 'hidden');
    $('#userlinks-container').css('visibility', 'visible');
  });

});


