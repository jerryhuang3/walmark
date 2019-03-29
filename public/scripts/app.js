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
    for(user of users) {
      $("<div>").text(user.full_name).appendTo($("body"));
    }
  });
});

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/comments"
  }).done((users) => {
    for(user of users) {
  $("<div>").text(user.text).appendTo($("body"));
}
});
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

//get links page
$('.container').on('click', '.links', function() {
  $.ajax({
    method: 'GET',
    url: '/links/' + this.id
  });
})


