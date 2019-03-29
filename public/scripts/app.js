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


function createCommentElement(data) {
  let $comment = `
    <article>
    <img class="comment-avatar" src="${escape(data.avatar)}">
    <div class="comment-content">
        <span class="comment-fullname">${escape(data.full_name)}</span>
        <span class="comment-date">${escape(data.create_date)}</span>
        <p class="comment-text">${escape(data.text)}</p>
    </div>
    </article>`
    return $comment;
}

function renderComments(comments) {
  for (let individual = 0; individual < comments.length; individual++) {
    $('#comments-container').prepend(createCommentElement(comments[individual]));
  }
}

function loadComments(){
  $.get('comments', function (allComments){
    renderComments(allComments);
  });
}

loadComments();

}); 