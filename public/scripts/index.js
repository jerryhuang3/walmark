
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
      // change size of item by toggling gigante class
      $grid.on( 'click', '.grid-item', function() {
        $(this).toggleClass('gigante');
        // trigger layout after item size changes
        $grid.masonry('layout');
      });

    });
  };

  function createHomeLinks(randomLinks) {
    var myArray = ['300', '450', '500'];
    var randomItem = myArray[Math.floor(Math.random() * myArray.length)];

    return $randomLinks = `
       <div class="links" xmlns="http://www.w3.org/1999/html">
          <a href="/links/${randomLinks.id}/"><img src="https://picsum.photos/200/${randomItem}/?random" /></a>
          <p>${randomLinks.title}</p>
       </div>`;
  }

});
