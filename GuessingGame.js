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

Game.prototype.playersGuessSubmission = function (num) {
    if ((typeof num !== 'number') || num < 1 || num > 100) {
        throw 'That is an invalid guess.';
    } else {
        this.playersGuess = num;
        return this.checkGuess();
    }
}

Game.prototype.checkGuess = function () {
    if(this.playersGuess === this.winningNumber)
        return "You Win!";
    else if(this.pastGuesses.includes(this.playersGuess))
        return "You have already guessed that number.";
    else { 
        this.pastGuesses.push(this.playersGuess);

        if(this.pastGuesses.length === 5)
            return "You Lose.";
        else if(this.difference() < 10)
            return "You're burning up!";
        else if(this.difference() < 25)
            return "You're lukewarm.";
        else if(this.difference() < 50)
            return "You're a bit chilly.";
        else 
            return "You're ice cold!";
    }
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
