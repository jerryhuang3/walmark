$( document ).ready(function() {
    function loadHomeLinks()
  {
    $.get('/api/linkstopics', function(allLinks) {
      renderHomeLinks(allLinks);
    });
  }
  ;
  loadHomeLinks();

  function renderHomeLinks(allLinks) {
    let randomLinks = allLinks;

    for (let i = 0; i < randomLinks.length; i++) {
      $("#link-container").prepend(createHomeLinks(randomLinks[i]));
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
        <div class="links">
            <p class="link-name">${randomLinks.linktitle}</p>
            <p>Topic: ${randomLinks.name}</p>
            <p class="link-desc">Description: ${randomLinks.description}</p>
            <a href="${randomLinks.url}" class="button secondary link-visit">Learn Now</a>
        </div>
       `;
  }

});
