function escape(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

$(() => {
  function createCommentElement(data) {
    let $comment = `
    <article>
    <img class="comment-avatar" src="${escape(data.avatar)}">
    <div class="comment-content">
        <span class="comment-fullname">${escape(data.full_name)}</span>
        <span class="comment-date">${moment(data.create_date).fromNow()}
        <p class="comment-text">${escape(data.text)}</p>
    </div>
    </article>`;
    return $comment;
  }

  function renderComments(comments) {
    for (let individual = 0; individual < comments.length; individual++) {
      $("#comments-container").prepend(
        createCommentElement(comments[individual])
      );
    }
  }

  function loadComments() {
    $.get("./comments", function(allComments) {
      renderComments(allComments);
    });
  }

  loadComments();

  //saving link
  $("#saveto").change(function() {
    $("#saved").fadeIn("slow");
    setTimeout(function() {
      $("#saved").fadeOut(function() {
        $("#saveform").submit();
        event.preventDefault();
      });
    }, 1000);
  });

  // Ratings hovering
  $(".star")
    .on("mouseover", function() {
      let mousedStar = $(this).data("value"); // The star currently mouse on
      $.each(
        $(this)
          .parent()
          .children(".star"),
        function(eachStar) {
          if (eachStar < mousedStar) {
            $(this).addClass("hover");
          } else {
            $(this).removeClass("hover");
          }
        }
      );
    })
    .on("mouseout", function() {
      $.each(
        $(this)
          .parent()
          .children(".star"),
        function() {
          $(this).removeClass("hover");
        }
      );
    })
    .on("click", function() {
      let mousedStar = $(this).data("value");
      var stars = $(this)
        .parent()
        .children(".star");

      for (i = 0; i < mousedStar; i++) {
        $(stars[i]).addClass("rating");
      }
      // Add or update your rating
      let linkID = window.location.pathname;
      linkID = linkID.replace(/\/links\//, "").replace("/", "");
      $.post(
        "/api/ratings",
        { rating: $(this).data("value"), linkID: linkID },
        function() {
          location.reload();
        }
      );
    });
});
