let squareArchive = [];
let playerArchive = []
let started = false;
let level = 0;
let clickCounter = 0;
const pressed = new Audio('sounds/pressed.wav');
const gameOver = new Audio('sounds/gameOver.wav');

//Returns a random square name e.g green, yellow, blue and red
const randomSquare = () => {
  const squares = $(".btn")
  return $(".btn").eq(Math.floor(Math.random() * squares.length));
}

//Adds effects to the pressed key
const squarePressed = (squarePressed) => {
  pressed.currentTime = 0;
  pressed.play();
  squarePressed.addClass('pressed')
  setTimeout(() => {
    squarePressed.removeClass('pressed')
  }, 100)
}

//Adds effects to the errored key
const errorPressed = (square) => {
  square.addClass('error')
  setTimeout(() => {
    square.removeClass('error')
  }, 100)
}

//Increases the level
const incrementLevel = () => {
  level += 1;
  $('#level-title').text(`Level ${level}`);
  const random = randomSquare();
  squareArchive.push(random);
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const loop = async () => {
    for (const a of squareArchive) {
      squarePressed(a)
      await wait(250)
    }
  }
  loop();
  playerArchive = []
}

//Player's click logic
const playerClick = (event) => {
  const playerSquare = event.target.id;
  playerArchive.push(playerSquare);
  const computerSquare = squareArchive[playerArchive.length - 1].attr('id');

  //If the player's click is correct
  if (computerSquare === playerSquare) {
    squarePressed($(event.target))
    if (squareArchive.length === playerArchive.length) {
      setTimeout(function () {
        incrementLevel();
      }, 1000);
    }
  } else {
    errorPressed($(event.target))
    gameReset()
  }
}

const gameReset = () => {
  $('#level-title').text("Game Over, press any key to restart");
  $("body").addClass("game-over")
  $(".btn").addClass("game-over-btn")
  started = false;
  level = 0;
  squareArchive = [];
  gameOver.play();
}

$(document).on('keypress', function () {
  if (!started) {
    incrementLevel();
    $("body").removeClass("game-over")
    $(".btn").removeClass("game-over-btn")
    started = true;
  }
})

$(".btn").click(event => {
  if (started) playerClick(event)
});
