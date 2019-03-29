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


