

function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
  });



  function createCommentElement(data) {
    let $comment = `
    <article>
    <img class="comment-avatar" src="${escape(data.avatar)}">
    <div class="comment-content">
        <span class="comment-fullname">${escape(data.full_name)}</span>
        <span class="comment-date">${escape(data.create_date)}</span>
        <p class="comment-text">${escape(data.text)}</p>
    </div>
    </article>`;
    return $comment;
  };

  function renderComments(comments) {
    for (let individual = 0; individual < comments.length; individual++) {
      $('#comments-container').prepend(createCommentElement(comments[individual]));
    }
  }

  function loadComments() {
    $.get('./comments', function(allComments) {
      renderComments(allComments);
    });
  };

  loadComments();







// //Initialize Masonry Script
//
//
// function loadHomeLinks() {
//   $.get('/api/links', function(allLinks) {
//     renderHomeLinks(allLinks);
//   });
// };
// loadHomeLinks();
//
// function shuffle(a) {
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }
//
// function renderHomeLinks(allLinks) {
//     let randomLinks = shuffle(allLinks);
//
//     for (let i = 0; i < randomLinks.length; i++) {
//       $("#link-container").prepend(createHomeLinks(randomLinks[i])).masonry('prepended',createHomeLinks(randomLinks[i]));
//     }
//   let $grid = $('#link-container').imagesLoaded(function() {
//     $grid.masonry({
//       itemSelector: '.links',
//       columnWidth: '.links',
//       horizontalOrder: true,
//       percentPosition: true,
//     });
//   });
// };
//
// function createHomeLinks(randomLinks) {
//   var myArray = ['200','300','400','500','600'];
//   var randomItem = myArray[Math.floor(Math.random()*myArray.length)];
//
//   return $randomLinks = `
//        <div class="links" xmlns="http://www.w3.org/1999/html">
//           <a href="/links/${randomLinks.id}"><img src="https://picsum.photos/200/${randomItem}/?random" /></a>
//           <h2>${randomLinks.title}</h2>
//           <p>${randomLinks.description}</p>
//        </div>`;
// }





});

