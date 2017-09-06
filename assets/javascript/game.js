if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    var animalButton = document.getElementById("animalChoice");
    var animalLabel = animalButton.nextElementSibling;
    var sportsButton = document.getElementById("sportsChoice");
    var sportsLabel = sportsButton.nextElementSibling;
    var musicButton = document.getElementById("musicChoice");
    var musicLabel = musicButton.nextElementSibling;
    var transportButton = document.getElementById("transportChoice");
    var transportLabel = transportButton.nextElementSibling;

    var radioButtons = document.getElementsByClassName("radioButton");
    var gameWord = document.getElementById("gameWord");
    var winsSpan = document.getElementById("numOfWins");
    var guessesLeftSpan = document.getElementById("numOfGuesses");
    var lettersGuessedSpan = document.getElementById("lettersGuessed");

    var myGame = new Game();
    
    function Game() {
        this.word = '';
        this.displayWord = '';
        this.wins = 0;
        this.guessesLeft = 8;
        this.lettersGuessed = '';
    }

    Game.prototype.getWord = function() {
        return this.word;
    }

    Game.prototype.setWord = function(word) {
        this.word = word;
    }

    Game.prototype.getDisplayWord = function() {
        return this.displayWord;
    }

    Game.prototype.setDisplayWord = function(displayWord) {
        this.displayWord = displayWord;
        gameWord.innerHTML = displayWord;
    }

    Game.prototype.getWins = function() {
        return this.wins;    
    }

    Game.prototype.setWins = function(wins) {
        this.wins = wins;
        winsSpan.innerHTML = wins;
    }

    Game.prototype.getGuessesLeft = function() {
        return guessesLeft;
    }

    Game.prototype.setGuessesLeft = function(guessesLeft) {
        this.guessesLeft = guessesLeft;
        guessesLeftSpan.innerHTML = guessesLeft;
    }
    
    Game.prototype.getLettersGuessed = function() {
        return lettersGuessed;
    }

    Game.prototype.setLettersGuessed = function(lettersGuessed) {
        this.lettersGuessed = lettersGuessed;
        lettersGuessedSpan.innerHTML = lettersGuessed;
    }

    Game.prototype.newGame = function() {
        myGame.generateWord();
        myGame.setGuessesLeft(8);
        myGame.setLettersGuessed("");
    }

    Game.prototype.generateWord = function() {
        var category = null;
        for (var i = 0; i < radioButtons.length; i++) {
            if (radioButtons[i].checked) {
                category = radioButtons[i].value;
            }
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.datamuse.com/words?ml=" + category, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                var myJSON = JSON.parse(xhr.responseText);
                var randomIndex = Math.floor(Math.random() * (myJSON.length));
                var newWord = myJSON[randomIndex].word;
                console.log(newWord);
                myGame.setWord(newWord);
                var newDisplayWord = '';
                for (var i = 0; i < newWord.length; i++) {
                    newDisplayWord += "_";
                }
                myGame.setDisplayWord(newDisplayWord);
            }
            else {
                // There has been a problem
            }
        }
        xhr.send(null);
    }

    Game.prototype.checkChar = function(char) {
        var myWord = myGame.getWord();
        for (var i = 0; i < myWord.length; i++) {
            if (myWord.charAt(i) === char) {
                console.log(char + " " + myWord + " " + i);
                var newChars = '';
                for (var ii = 0; ii < myWord.length; ii++) {
                    if (ii === i) newChars += char;
                    else newChars += '_';
                }
                myGame.setDisplayWord(myGame.addChars(newChars));
            }
        }

    }

    Game.prototype.addChars = function(chars) {
        var newDisplayWord = '';
        for (var i = 0; i < myGame.getWord().length; i++) {
            if (myGame.getDisplayWord().charAt(i) != '_') {
                newDisplayWord += myGame.getDisplayWord().charAt(i);
            }
            else if (chars.charAt(i) != '_') newDisplayWord += chars.charAt(i);
            else newDisplayWord += '_';
        }
        console.log(newDisplayWord);
        return newDisplayWord;
    }

    myGame.newGame();

    document.addEventListener("keyup", function(e) {
        if (e.keyCode >= 65 && e.keyCode <= 90) myGame.checkChar(e.key);
    }, false);
}