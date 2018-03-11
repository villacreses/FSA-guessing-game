function generateWinningNumber () {
    return Math.floor(Math.random() * 100 + 1);
}

function shuffle (arr) {
    var remaining = arr.length, temp, i;

    while (remaining) {
        i = Math.floor(Math.random() * remaining--);

        temp = arr[remaining];
        arr[remaining] = arr[i];
        arr[i] = temp;
    }

    return arr;
}

function Game () {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function () {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function () {
    return (this.playersGuess < this.winningNumber);
}

Game.prototype.playersGuessSubmission = function () {
    if ((typeof this.playersGuess !== 'number') || 
        Number.isNaN(this.playersGuess) || 
        this.playersGuess < 1 || this.playersGuess > 100) {
      throw 'That is an invalid guess.';
    } else {
      return this.checkGuess();
    }
}

Game.prototype.correctAnswer = function (guess = this.playersGuess) {
  return (guess === this.winningNumber);
}

Game.prototype.repeatedGuess = function () {
  return this.pastGuesses.includes(this.playersGuess);
}

Game.prototype.checkGuess = function () {
  if (this.repeatedGuess())
    return "You have already guessed that number.";

  this.pastGuesses.push(this.playersGuess);

  let flavortext = this.isLower() ? ' Guess higher!' : ' Guess lower!';

  if (this.correctAnswer())
    return "You Win!";
  else if(this.pastGuesses.length === 5)
    return "You Lose.";
  else if(this.difference() < 10)
    return "You're burning up!" + flavortext;
  else if(this.difference() < 25)
    return "You're lukewarm." + flavortext;
  else if(this.difference() < 50)
    return "You're a bit chilly." + flavortext;
  else 
    return "You're ice cold!" + flavortext;
}

function newGame () {
    return new Game();
}

Game.prototype.provideHint = function () {
    var arr = shuffle([
        this.winningNumber, 
        generateWinningNumber(),
        generateWinningNumber()
    ]);

    return arr;
}

$(document).ready(function () {
  let game, subheading = $('h2');
  
  let resetGame = function () {
    game = newGame(),
    subheading.text('Guess a number between 1 and 100! (inclusive)');

    $('.list-inline-item').each(function (i) {
      $(this).text('-');
      $(this).removeClass('.right .wrong');
    });
  }

  resetGame();

  let toggleInput = function (t) {
    $('#submit').prop('disabled', t);
    $('#player-input').prop('disabled', t);
    $('#hint').prop('disabled', t);
  }

  let evaluateInput = function () {
    game.playersGuess = Number.parseInt($('#player-input').val());
    $('#player-input').val('');

    subheading.text(game.playersGuessSubmission());
    if(subheading.text() !== 'You have already guessed that number.') {
      $('.list-inline-item').each(function (i) {
        let input = game.pastGuesses[i] ? game.pastGuesses[i] : '-';
        let setBG = game.correctAnswer() ? '.right':'.wrong';
        $(this).text(input);
      })
    }

    if (subheading.text() === 'You Win!') {
      toggleInput(1);
    } else if (subheading.text() === 'You Lose.') {
      toggleInput(1);
      subheading.text('You Lose. The answer was: ' + game.winningNumber);
    }
  }

  $('#submit').click(evaluateInput);

  $('input').on('keypress', function (event) {
    if(event.which === 13) evaluateInput();
  });

  $('#hint').click(function () {
    let hints = game.provideHint().join('  ');
    subheading.text('One of these is the answer: ' + hints);
  });

  $('#reset').click(function () {
    toggleInput(0);
    resetGame();
  });
});
