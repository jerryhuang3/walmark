function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.full_name).appendTo($("body"));
//     }
//   });
// });

$(document).ready(function() {
  //Initialize Masonry Script
  var $grid = $('.container').imagesLoaded(function () {
    $grid.masonry({
      itemSelector: '.links',
      columnWidth: '.links',
      horizontalOrder: true,
      percentPosition: true,
      stagger: 30
    });
  });
});

  $(document).foundation();

//get links page
// function renderComments(comments) {
//   for (let individual = 0; individual < comments.length; individual++) {
//     $('.link-comments').prepend(createComment(comments[individual]));
//   }
// }
// function loadTweets(){
//   $.get(`http://localhost:8080/links/${this.id}/comments`, function (comments){
//     renderTweets(comments);
//   });
// }
// function createTweetElement(data) {
//   let $comment = `
//     <h4>Comments</h4>
//     <img class="comment-avatar" src="<%=comment_avatar%>">
//     <div class="comment-content">
//         <span class="comment-fullname"><%=comment_name%></span>
//         <span class="comment-date">5d</span>
//         <p class="comment-text"><%=comment_text%></p>
//     </div>`


