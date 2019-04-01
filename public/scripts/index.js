
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
        $("#link-container").prepend(createHomeLinks(randomLinks[i], (925 + i)));
    }
    let $grid = $('#link-container').imagesLoaded(function() {
      $grid.masonry({
        itemSelector: '.links',
        columnWidth: '.links',
        gutter: 20,
        horizontalOrder: true,
        percentageWidth: true
      });
    });
  };

  function createHomeLinks(randomLinks, count) {
    const myArray = ['400', '500', '600'];
    const randomItem = myArray[Math.floor(Math.random() * myArray.length)];

    return $randomLinks = `
       <div class="links">
          <img src="https://picsum.photos/300/${randomItem}/?image=${count}" />
          <a href="/links/${randomLinks.id}/"><div class="overlay-img"></div></a>
          <p><strong>${randomLinks.title}</strong></p>
       </div>`;
  }

});
