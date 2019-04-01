$(document).ready(function() {

  const urlParams = new URLSearchParams(window.location.search);
  const userSearch = urlParams.get('search');


  // Receives JSON data of search
  $.get(`/results/${userSearch}`, { search: userSearch }, function(searchResults) {
      renderSearchLinks(searchResults);
    });

  function renderSearchLinks(searchData) {
    for (let i = 0; i < searchData.length; i++) {
      $("#link-container").prepend(createSearchLinks(searchData[i]));
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

  function createSearchLinks(searchLinks) {
    var myArray = ['400', '450', '500', '550', '600'];
    var randomItem = myArray[Math.floor(Math.random() * myArray.length)];
    return $searchResults = `
       <div class="links">
          <img src="https://picsum.photos/300/${randomItem}/?random" />
           <a href="/links/${searchLinks.id}/"><div class="overlay-img"></div></a>
          <p><strong>${searchLinks.title}</strong></p>
       </div>`;
  }
});
