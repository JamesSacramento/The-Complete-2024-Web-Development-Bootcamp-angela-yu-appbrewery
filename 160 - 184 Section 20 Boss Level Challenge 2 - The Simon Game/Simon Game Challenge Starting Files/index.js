const buttonColors = ["green", "red", "yellow", "blue"];
let gamePattern = [];
let userClickedPattern = [];
let level = 0;
let started = false;

document.addEventListener("keypress", function() {
  if (!started) {
    document.getElementById("level-title").innerText = `Level ${level}`;
    nextSequence();
    started = true;
  }
});

document.querySelectorAll(".btn").forEach(button => {
  button.addEventListener("click", function() {
    const userChosenColor = this.id;
    userClickedPattern.push(userChosenColor);

    playSound(userChosenColor);
    animatePress(userChosenColor);

    checkAnswer(userClickedPattern.length - 1);
  });
});

function nextSequence() {
  userClickedPattern = [];
  level++;
  document.getElementById("level-title").innerText = `Level ${level}`;

  const randomNumber = Math.floor(Math.random() * 4);
  const randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);

  playSequence();
}

function playSequence() {
  let i = 0;
  const interval = setInterval(() => {
    animateFlash(gamePattern[i]);
    playSound(gamePattern[i]);
    i++;
    if (i >= gamePattern.length) {
      clearInterval(interval);
    }
  }, 600);
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(() => {
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    document.getElementById("level-title").innerText = "Game Over, Press Any Key to Restart";

    document.body.classList.add("game-over");
    setTimeout(() => {
      document.body.classList.remove("game-over");
    }, 200);

    startOver();
  }
}

function playSound(name) {
  const audio = new Audio(`sounds/${name}.mp3`);
  audio.play();
}

function animatePress(currentColor) {
  const activeButton = document.getElementById(currentColor);
  activeButton.classList.add("pressed");
  setTimeout(() => {
    activeButton.classList.remove("pressed");
  }, 100);
}

function animateFlash(color) {
  const button = document.getElementById(color);
  button.classList.add("flash");
  setTimeout(() => {
    button.classList.remove("flash");
  }, 200);
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}
