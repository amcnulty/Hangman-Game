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

    var myGame = new Game();
    
    function Game() {
        this.word = '';
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

    Game.prototype.getWins = function() {
        return this.wins;    
    }

    Game.prototype.setWins = function(wins) {
        this.wins = wins;
    }

    Game.prototype.getGuessesLeft = function() {
        return guessesLeft;
    }

    Game.prototype.setGuessesLeft = function(guessesLeft) {
        this.guessesLeft = guessesLeft;
    }
    
    Game.prototype.getLettersGuessed = function() {
        return lettersGuessed;
    }

    Game.prototype.setLettersGuessed = function(lettersGuessed) {
        this.lettersGuessed = lettersGuessed;
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
                console.log(myJSON[1].word);
            }
            else {
                // There has been a problem
            }
        }
        xhr.send(null);
    }

    myGame.generateWord();
    
}