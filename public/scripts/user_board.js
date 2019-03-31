$( document ).ready(function() {
    function loadHomeLinks()
  {
    $.get('/api/boardslinks', function(allLinks) {
      renderHomeLinks(allLinks);
    });
  }
  ;
  loadHomeLinks();

  var pathArray = window.location.pathname.split('/');
  // pathArray.forEach(element => {
  //   console.log('element:', element)
  // })

  let board = pathArray[4];
  // console.log('board:', board);

  function renderHomeLinks(allLinks) {
    let randomLinks = (allLinks);
    console.log(randomLinks)
    randomLinks.forEach(element => {
      if (element.boardid == board) {
        $("#link-container").prepend(createHomeLinks(randomLinks[board]))
      }
    })

    let $grid = $('#link-container').imagesLoaded(function() {
      $grid.masonry({
        itemSelector: '.links',
        columnWidth: '.links',
        horizontalOrder: true,
        percentPosition: true,
      });
    });
  };

  function createHomeLinks(randomLinks) {
    var myArray = ['200', '300', '400', '500', '600'];
    var randomItem = myArray[Math.floor(Math.random() * myArray.length)];

    return $randomLinks = `
       <div class="links" xmlns="http://www.w3.org/1999/html">
          <a href="/links/${randomLinks.id}/"><img src="https://picsum.photos/200/${randomItem}/?random" /></a>
          <p>Topic: ${randomLinks.name}</p>
          <p><strong>${randomLinks.linktitle}</strong></p>
          <p>${randomLinks.description}</p>
          <a href="${randomLinks.url}" class="button secondary link-visit">Learn Now</a>
       </div>`;
  }
});
