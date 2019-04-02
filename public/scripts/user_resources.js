$( document ).ready(function() {

  // Retrieving resource information
  function loadBoards() {
    $.get('/api/userboards', function(allBoards) {
      renderBoards(allBoards);
    });
    $.get('/api/userlinks', function(allLinks) {
      renderLinks(allLinks);

    });
    $.get('/api/markedlinks', function(savedLinks) {
      markedLinks(savedLinks);
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

    $boards = `
        <div class="boards">
            <h2>My Walls</h2>
        </div>`;
    $("#account-nav").prepend($boards);

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

  // Creates user's board element
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

    $links = `
        <div class="links">
            <h2>My Links</h2>
        </div>`;
    $("#account-nav").prepend($links);

    for (let i = 0; i < usersLinks.length; i++) {
      $("#userlinks-container").prepend(createLinks(usersLinks[i], (975 + i)));
    }
    let $grid = $('#userlinks-container').imagesLoaded(function() {
      $grid.masonry({
        itemSelector: '.links',
        columnWidth: 200,
        horizontalOrder: true,
        percentPosition: true
      });
    });
  };

  // Creates user's link element
  function createLinks(links, count) {
    return $links = `
       <div class="links">
        <img src="https://picsum.photos/400/500/?image=${count}">
         <a href="/links/${links.id}/"><div class="overlay-img"></div></a>
         <p>${links.title}</p>
       </div>`;
  };

  // Loads all of a user's marked links
  function markedLinks(savedLinks) {
    if (savedLinks[0] === undefined) {
      $links = `
        <div class="create">
            <h2>You have no marked links!</h2>
        </div>`;
      return $("#markedlinks-container").append($links);
    };

    $saved = `
        <div class="saved">
            <h2>Marked Links</h2>
        </div>`;
    $("#account-nav").prepend($saved);

    for (let i = 0; i < savedLinks.length; i++) {
      $("#markedlinks-container").prepend(createMarked(savedLinks[i], (700 + i)));
    }
    let $grid = $('#markedlinks-container').imagesLoaded(function() {
      $grid.masonry({
        itemSelector: '.marked',
        columnWidth: 200,
        horizontalOrder: true,
        percentPosition: true
      });
    });
  };

  function createMarked(links, count) {
    return $links = `
       <div class="marked">
        <img src="https://picsum.photos/400/500/?image=${count}">
         <a href="/links/${links.id}/"><div class="overlay-img"></div></a>
         <p>${links.title}</p>
       </div>`;
  };


  $( "#click1" ).click(function() {
    $('#userlinks-container').hide();
    $('#markedlinks-container').hide();
    $('#account-nav .links').hide();
    $('#account-nav .saved').hide();

    $('#boards-container').show();
    $('#account-nav .boards').show();
  });

  // Shows a user's links
  $( "#click2" ).on('click', function() {
    $('#boards-container').hide();
    $('#markedlinks-container').hide();
    $('#account-nav .boards').hide();
    $('#account-nav .saved').hide();

    $('#userlinks-container').css({'visibility': 'visible'});
    $('#userlinks-container').show();
    $('#account-nav .links').show();
  });

  // Shows a user's marked links
  $( "#click3" ).on('click', function() {
    $('#boards-container').hide();
    $('#userlinks-container').hide();
    $('#account-nav .boards').hide();
    $('#account-nav .links').hide();

    $('#markedlinks-container').css({'visibility': 'visible'});
    $('#markedlinks-container').show();
    $('#account-nav .saved').show();
  });

});
