$( document ).ready(function() {
    function loadHomeLinks()
  {
    $.get('/api/links', function(allLinks) {
      renderHomeLinks(allLinks);
    });
  }
  ;
  loadHomeLinks();

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderHomeLinks(allLinks) {
    let randomLinks = shuffle(allLinks);

    for (let i = 0; i < randomLinks.length; i++) {
      $("#link-container").prepend(createHomeLinks(randomLinks[i])).masonry('prepended', createHomeLinks(randomLinks[i]));
    }
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
          <h2>${randomLinks.title}</h2>
          <p>${randomLinks.description}</p>
       </div>`;
  }

});
