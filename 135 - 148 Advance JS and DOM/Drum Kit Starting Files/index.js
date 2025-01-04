var drumSet = document.querySelector(".set");

function handleKeyPress(event) {
  playSound(event.key);
  animateButton(event.key);
  applyGradient(event.key);
}

function handleClick() {
  var buttonInnerHTML = this.innerHTML;
  playSound(buttonInnerHTML);
  animateButton(buttonInnerHTML);
  applyGradient(buttonInnerHTML);
}

function playSound(key) {
  var soundMap = {
    'w': 'sounds/tom-1.mp3',
    'a': 'sounds/tom-2.mp3',
    's': 'sounds/tom-3.mp3',
    'd': 'sounds/tom-4.mp3',
    'j': 'sounds/snare.mp3',
    'k': 'sounds/crash.mp3',
    'l': 'sounds/kick-bass.mp3'
  };

  var soundFile = soundMap[key];
  
  if (soundFile) {
    var audio = new Audio(soundFile);
    audio.play();
  } else {
    console.log("Some other key was pressed.");
  }
}

function animateButton(key) {
  var button = document.querySelector("." + key);
  if (button) {
    button.classList.add("pressed");
    setTimeout(function() {
      button.classList.remove("pressed");
    }, 100);
  }
}

function applyGradient(key) {
  document.body.className = '';

  switch (key) {
    case 'k':
      document.body.classList.add("k-radial-gradient-animation");
      break;
    case 'l':
      document.body.classList.add("l-radial-gradient-animation");
      break;
    case 'w':
    case 'a':
      document.body.classList.add("w-a-radial-gradient-animation");
      break;
    case 's':
    case 'd':
      document.body.classList.add("s-d-radial-gradient-animation");
      break;
    case 'j':
      document.body.classList.add("j-radial-gradient-animation");
      break;
  }
  setTimeout(function() {
    document.body.className = '';
  }, 500);
}

document.addEventListener("keydown", handleKeyPress);

var drumButtons = drumSet.querySelectorAll(".drum");
drumButtons.forEach(function(button) {
  button.addEventListener("click", handleClick);
});
