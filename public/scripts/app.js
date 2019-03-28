$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.full_name).appendTo($("body"));
    }
  });;
});

$(document).ready(function(){
  //Initialize Masonry Script
  var $grid = $('.container').imagesLoaded( function() {
    $grid.masonry({
      itemSelector: '.links',
      columnWidth: '.links',
      horizontalOrder: true,
      percentPosition: true,
      stagger: 30
    });
  });
});
