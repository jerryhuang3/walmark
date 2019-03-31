$(document).ready(function() {

  const urlParams = new URLSearchParams(window.location.search);
  const userSearch = urlParams.get('search');

  // Receives JSON data of search
  $.get(`/results/${userSearch}`, { search: userSearch }, function(searchResults) {
      renderSearchLinks(searchResults);
    });

  // $('.search').on('click', function() {
  //   let input = ($(this).closest('form')).val();
  //   if (input === 'Javascript') {
  //     console.log('ERROR');
  //   }
  // });

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
    console.log(searchLinks);
    return $searchResults = `
       <div class="links">
          <img src="https://picsum.photos/300/${randomItem}/?random" />
           <a href="/links/${searchLinks.id}/"><div class="overlay-img"></div></a>
          <p><strong>${searchLinks.title}</strong></p>
       </div>`;
  }

















});

//
//   let maxInput = parseInt($("span.counter")[0].textContent);
//
//   // Character counting & adding error message if tweet goes past 140 characters
//   $("textarea").keyup(function() {
//     let tweetChar = $(this).val().length;
//     let remaining = maxInput - tweetChar;
//     $(".counter")[0].textContent = remaining;
//
//     if ($(".counter")[0].textContent < 0) {
//       $(".counter").addClass("error");
//       $(".error").removeClass("hidden");
//       $("textarea").addClass("textarea-error");
//     } else {
//       $(".counter").removeClass("error");
//       $(".error").addClass("hidden");
//       $("textarea").removeClass("textarea-error");
//     }
//   });
//
//   // Removes error messages clicking on an empty form
//   $("textarea").on("click", function() {
//     let tweetChar = $(this).val().length;
//
//     if (tweetChar === 0) {
//       $(".error").addClass("hidden");
//       $("textarea").removeClass("textarea-error");
//     }
//   });
//
// });
