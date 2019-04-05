// Search button functionality
$(() => {
  $('.search').on('click', function() {
    let searchInput = $('input').val();
    if (searchInput.length === 0) {
      return;
    }
    $('#search').submit();
  });
});
