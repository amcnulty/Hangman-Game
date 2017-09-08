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
    radioButtons[0].checked = true;
    var customCategoryInput = document.getElementById("customCategoryInput");
    var newWordButton = document.getElementById("newWordButton");
    var userGuessInput = document.getElementById("userGuessInput");
    var gameWord = document.getElementById("gameWord");
    var winsSpan = document.getElementById("numOfWins");
    var guessesLeftSpan = document.getElementById("numOfGuesses");
    var lettersGuessedSpan = document.getElementById("lettersGuessed");
    var hangingMan = document.getElementById("hangingMan");
    var gameWon = document.getElementById("gameWon");
    var gameLost = document.getElementById("gameLost");
    var ding = new Audio("assets/sounds/happy_ding.mp3");
    
    var myGame = new Game();
    
    function Game() {
        this.word = '';
        this.displayWord = '';
        this.wins = 0;
        this.guessesLeft = 8;
        this.lettersGuessed = [];
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
        if(myGame.checkVictory(displayWord)) {
            var newWins = myGame.getWins();
            newWins++;
            myGame.setWins(newWins);
            myGame.gameWon();
        }
    }
    
    Game.prototype.getWins = function() {
        return this.wins;
    }
    
    Game.prototype.setWins = function(wins) {
        this.wins = wins;
        winsSpan.innerHTML = wins;
    }
    
    Game.prototype.getGuessesLeft = function() {
        return this.guessesLeft;
    }
    
    Game.prototype.setGuessesLeft = function(guessesLeft) {
        this.guessesLeft = guessesLeft;
        guessesLeftSpan.innerHTML = guessesLeft;
        hangingMan.style.background = "url(assets/images/hang" + (this.guessesLeft + 1) + ".png) center center no-repeat";
    }
    
    Game.prototype.decreaseGuesses = function() {
        this.guessesLeft--;
        guessesLeftSpan.innerHTML = this.guessesLeft;
        hangingMan.style.background = "url(assets/images/hang" + (this.guessesLeft + 1) + ".png) center center no-repeat";
        if (this.guessesLeft === 0) myGame.gameLost();
    }
    
    Game.prototype.getLettersGuessed = function() {
        return this.lettersGuessed;
    }
    
    Game.prototype.setLettersGuessed = function(lettersGuessed) {
        this.lettersGuessed = lettersGuessed;
        var newLettersGuessed = '';
        for (var i = 0; i < lettersGuessed.length; i++) {
            newLettersGuessed += lettersGuessed[i];
        }
        lettersGuessedSpan.innerHTML = newLettersGuessed;
    }
    
    Game.prototype.addLetterGuessed = function(char) {
        if (myGame.getLettersGuessed().indexOf(char) === -1) {
            myGame.decreaseGuesses();
            myGame.getLettersGuessed().push(char);
            myGame.setLettersGuessed(myGame.getLettersGuessed());
        }
    }

    Game.prototype.playSound = function(sound) {
        if (sound === "ding" && ding.paused) {
            ding.play();
        }
    }

    Game.prototype.deselectRadioButtons = function() {
        for (var i = 0; i < radioButtons.length; i++) {
            radioButtons[i].checked = false;
        }
    }
    
    Game.prototype.checkVictory = function(displayWord) {
        var victory = true;
        for (var i = 0; i < displayWord.length; i++) {
            if (displayWord.charAt(i) === '_') {
                victory = false;
                break;
            }
        }
        return victory;
    }
    
    Game.prototype.gameWon = function() {
        gameWon.className = "gameWon";
    }
    
    Game.prototype.gameLost = function() {
        gameLost.className = "gameLost";
    }
    
    Game.prototype.newGame = function() {
        myGame.generateWord();
        myGame.setGuessesLeft(8);
        myGame.setLettersGuessed([]);
        
    }
    
    Game.prototype.generateWord = function() {
        var category = null;
        for (var i = 0; i < radioButtons.length; i++) {
            if (radioButtons[i].checked) {
                category = radioButtons[i].value;
            }
        }
        if (category === null) {
            category = customCategoryInput.value.replace(/\s+/g, '+').toLowerCase();
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.datamuse.com/words?ml=" + category, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                var myJSON = JSON.parse(xhr.responseText);
                var randomIndex = Math.floor(Math.random() * (myJSON.length));
                try {
                    var newWord = myJSON[randomIndex].word;
                }
                catch (e) {
                    alert("Custom Category Return No Results.\nPlease Try Again.");
                }
                while (newWord.indexOf(' ') != -1 || newWord.indexOf('-') != -1) {
                    randomIndex = Math.floor(Math.random() * (myJSON.length));
                    newWord = myJSON[randomIndex].word;
                }
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
        var match = false;
        for (var i = 0; i < myWord.length; i++) {
            if (myWord.charAt(i) === char) {
                match = true;
                var newChars = '';
                for (var ii = 0; ii < myWord.length; ii++) {
                    if (ii === i) newChars += char;
                    else newChars += '_';
                }
                myGame.playSound("ding");
                myGame.setDisplayWord(myGame.addChars(newChars));
            }
        }
        if (!match) myGame.addLetterGuessed(char);
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
        return newDisplayWord;
    }
    
    myGame.newGame();
    
    document.addEventListener("keyup", function(e) {
        userGuessInput.value = e.key;
        if (e.keyCode >= 65 && e.keyCode <= 90 && customCategoryInput != document.activeElement) myGame.checkChar(e.key);
    }, false);
    
    for (var i = 0; i < radioButtons.length; i++) {
        radioButtons[i].addEventListener("click", function() {
            myGame.newGame();
            customCategoryInput.value = '';
        }, false);
    }

    customCategoryInput.addEventListener("click", function() {
        myGame.deselectRadioButtons();
    }, false);

    newWordButton.addEventListener("click", function() {
        myGame.generateWord();
    }, false);

    gameWon.addEventListener("animationend", function() {
        gameWon.className = '';
        myGame.newGame();
    }, false);
    
    gameLost.addEventListener("animationend", function() {
        gameLost.className = '';
        myGame.newGame();
    }, false);
}