$( document ).ready(function() {

  function loadHomeLinks() {
    $.get('/api/links', function(allLinks) {
      renderHomeLinks(allLinks);
    });
  };
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
      let count = i + 969;
      $("#link-container").prepend(createHomeLinks(randomLinks[i], count));
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
    let imgNum = count;
      if (imgNum === 1007) {
        imgNum = imgNum + 1;
      }
    const heightArray = ['400','450', '500', '600', '700'];
    const randomItem = heightArray[Math.floor(Math.random() * heightArray.length)];

    return $randomLinks = `
       <div class="links">
          <img src="https://picsum.photos/300/${randomItem}/?image=${imgNum}" />
          <a href="/links/${randomLinks.id}/"><div class="overlay-img"></div></a>
          <p><strong>${randomLinks.title}</strong></p>
       </div>`;
  }

});
