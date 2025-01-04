$(document).ready(function() {
  // Default image
  const defaultImage = "https://images.pexels.com/photos/2086748/pexels-photo-2086748.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  $("#sunrise-img").attr("src", defaultImage);

  $("#sunrise-img").click(function() {
    const isZoomed = $(this).hasClass("zoomed");

    if (!isZoomed) {
      $(this).addClass("zoomed");
    } else {
      $(this).removeClass("zoomed");
    }
  });

  // Existing functions
  $("#colorBtn").click(function() {
    const randomColor = getRandomColor();
    $("h1").css("color", randomColor);
  });

  $("#imageBtn").click(function() {
    const randomImage = getRandomImage();
    $("#sunrise-img").attr("src", randomImage);
  });

  $("#bigTitleBtn").click(function() {
    $("h1").toggleClass("big-title");
  });
});

let imageLinks = [
  "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/2086748/pexels-photo-2086748.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/220938/pexels-photo-220938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
];

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * imageLinks.length);
  return imageLinks[randomIndex];
}
