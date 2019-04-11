$(document).ready(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const userSearch = urlParams.get("search");

  // Search button functionality;
  $(".search").on("click", function() {
    let searchInput = $("input").val();
    if (searchInput.length === 0) {
      return;
    }
    $("#search").submit();
  });

  // Receives JSON data of search
  $.get(`/results/${userSearch}`, function(searchResults) {
    renderSearchLinks(searchResults);
  });

  function renderSearchLinks(searchData) {
    for (let i = 0; i < searchData.length; i++) {
      $("#link-container").prepend(createSearchLinks(searchData[i], i + 970));
    }

    let $grid = $("#link-container").imagesLoaded(function() {
      $grid.masonry({
        itemSelector: ".links",
        columnWidth: ".links",
        gutter: 20,
        horizontalOrder: true,
        percentageWidth: true
      });
    });
  }

  function createSearchLinks(searchLinks, count) {
    const heightArray = ["400", "450", "500", "600", "700"];
    const randomItem =
      heightArray[Math.floor(Math.random() * heightArray.length)];
    return ($searchResults = `
       <div class="links">
          <img src="https://picsum.photos/300/${randomItem}/?image=${count}" />
           <a href="/links/${
             searchLinks.id
           }/"><div class="overlay-img"></div></a>
          <p><strong>${searchLinks.title}</strong></p>
       </div>`);
  }
});
