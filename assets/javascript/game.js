// Hangman Game 2017
// By: Aaron Michael McNulty
// Monkey Stomp Games 2017
//
// All rights reserved
if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    // GLOBAL VARIABLES
    /** An array of all the radio buttons.*/
    var radioButtons = document.getElementsByClassName("radioButton");
    /** Initialize the first radio button to be checked.*/
    radioButtons[0].checked = true;
    /** The custom category input field.*/
    var customCategoryInput = document.getElementById("customCategoryInput");
    /** The new word button for generating new word options.*/
    var newWordButton = document.getElementById("newWordButton");
    /**  The user guess input that shows on mobile devices so the keyboard can be displayed.*/ 
    var userGuessInput = document.getElementById("userGuessInput");
    /** The word that is displayed with the underscores in the current word box.*/
    var gameWord = document.getElementById("gameWord");
    /** The number of wins displayed.*/
    var winsSpan = document.getElementById("numOfWins");
    /** The number of guesses left before losing game.*/
    var guessesLeftSpan = document.getElementById("numOfGuesses");
    /** The letters the user has already guessed.*/
    var lettersGuessedSpan = document.getElementById("lettersGuessed");
    /** The space where the hangman picture is shown.*/
    var hangingMan = document.getElementById("hangingMan");
    /** The alert that is shown when a game is won.*/
    var gameWon = document.getElementById("gameWon");
    /** The alert that is shown when a game is lost.*/
    var gameLost = document.getElementById("gameLost");
    /** The audio file that is played when a letter is correctly guessed.*/
    var ding = new Audio("assets/sounds/happy_ding.mp3");
    /** New instance of the Game object.*/
    var myGame = new Game();
    /**
     * The constructor for the Game object.
     */
    function Game() {
        this.word = '';
        this.displayWord = '';
        this.wins = 0;
        this.guessesLeft = 8;
        this.lettersGuessed = [];
    }
    /**
     * Getter method for the word variable of the game object.
     * 
     * @return {String} word
     *  The word that is being guessed by the player.
     */
    Game.prototype.getWord = function() {
        return this.word;
    }
    /**
     * Setter method for the word variable of the game object.
     * @param {String} word
     *  The string to be used to set word to.
     */
    Game.prototype.setWord = function(word) {
        this.word = word;
    }
    /**
     * Getter method for the displayWord variable of the game object.
     * @return
     *  The word that is being displayed to the user.
     */
    Game.prototype.getDisplayWord = function() {
        return this.displayWord;
    }
    /**
     * Setter method for the displayWord variable of the game object.
     * Also sets the inner html of the game word element.
     * This method checks for a game victory by calling the checkVictory method.
     * @param {String} displayWord
     *  The string to be used to set displayWord to.
     */
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
    /**
     * Getter method for the wins variable of the game object.
     * @return {Number} wins
     *  The number of wins for this game session.
     */
    Game.prototype.getWins = function() {
        return this.wins;
    }
    /**
     * Setter method for the wins variable of the game object.
     * @param {Number} wins
     *  The number to set the wins variable to.
     */
    Game.prototype.setWins = function(wins) {
        this.wins = wins;
        winsSpan.innerHTML = wins;
    }
    /**
     * Getter method for the guessesLeft variable of the game object.
     * @return {Number} guessesLeft
     *  The guesses left before the round is lost.
     */
    Game.prototype.getGuessesLeft = function() {
        return this.guessesLeft;
    }
    /**
     * Setter method for the guessesLeft variable of the game object.
     * @param {Number} guessesLeft
     *  The number to set guessesLeft to.
     */
    Game.prototype.setGuessesLeft = function(guessesLeft) {
        this.guessesLeft = guessesLeft;
        guessesLeftSpan.innerHTML = guessesLeft;
        hangingMan.style.background = "url(assets/images/hang" + (this.guessesLeft + 1) + ".png) center center no-repeat";
    }
    /**
     * Decrements the guessesLeft variable by one.
     * Updates what is shown in the guessesLeftSpan.
     * Changes the images for the hangman.
     * Checks for a game loss by calling the gameLost method.
     */
    Game.prototype.decreaseGuesses = function() {
        this.guessesLeft--;
        guessesLeftSpan.innerHTML = this.guessesLeft;
        hangingMan.style.background = "url(assets/images/hang" + (this.guessesLeft + 1) + ".png) center center no-repeat";
        if (this.guessesLeft === 0) myGame.gameLost();
    }
    /**
     * Getter method for the lettersGuessed variable of the game object.
     * @return {Array} lettersGuessed
     *  An array of single character strings representing the letters the user has guessed.
     */
    Game.prototype.getLettersGuessed = function() {
        return this.lettersGuessed;
    }
    /**
     * Setter method for the lettersGuessed variable of the game object.
     * @param {Array} lettersGuessed
     *  The array of single character letters to set lettersGuessed to.
     */
    Game.prototype.setLettersGuessed = function(lettersGuessed) {
        this.lettersGuessed = lettersGuessed;
        var newLettersGuessed = '';
        for (var i = 0; i < lettersGuessed.length; i++) {
            newLettersGuessed += lettersGuessed[i];
        }
        lettersGuessedSpan.innerHTML = newLettersGuessed;
    }
    /**
     * Checks if character parameter is in the array of already guessed letters.
     * If not this method calls decreaseGuess method, adds the new letter to the lettersGuessed array and updates the display.
     * @param {String} char
     *  The single character string to be added to the lettersGuessed array.
     */
    Game.prototype.addLetterGuessed = function(char) {
        if (myGame.getLettersGuessed().indexOf(char) === -1) {
            myGame.decreaseGuesses();
            myGame.getLettersGuessed().push(char);
            myGame.setLettersGuessed(myGame.getLettersGuessed());
        }
    }
    /**
     * Plays a ding sound.
     * @param {HTMLAudioElement} sound
     *  The audio element to be played.
     */
    Game.prototype.playSound = function(sound) {
        if (sound === "ding" && ding.paused) {
            ding.play();
        }
    }
    /**
     * Clears all selections on the radio buttons.
     */
    Game.prototype.deselectRadioButtons = function() {
        for (var i = 0; i < radioButtons.length; i++) {
            radioButtons[i].checked = false;
        }
    }
    /**
     * Checks to see if the user has won the game.
     * @param {String} displayWord
     *  The word to be checked if it is complete and therefore means a user victory
     * @return {boolean} victory
     *  Returns false if there is no victory. Returns true if there is a victory.
     */
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
    /**
     * Displays the game winning alert when called.
     */
    Game.prototype.gameWon = function() {
        gameWon.className = "gameWon";
    }
    /**
     * Displays the game losing alert when called.
     */
    Game.prototype.gameLost = function() {
        gameLost.className = "gameLost";
    }
    /**
     * Starts a new game when called. This method calls generateWord, setGuessesLeft, and setLettersGuessed
     */
    Game.prototype.newGame = function() {
        myGame.generateWord();
        myGame.setGuessesLeft(8);
        myGame.setLettersGuessed([]);
        
    }
    /**
     * Generates and new word based on what category is currently selected by user.
     * A GET request is sent to the Datamuse word generation API with the specifics.
     * If the returned result is an empty string then the user is alerted that they need to select a different category.
     * The Datamuse API returns with an array of word possibilities, this method randomly picks a word from the array.
     */
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
    /**
     * Checks if the letter the user guessed is part of the current word.
     * If it is this method will call the playSound method and the setDisplayWord method.
     * If the character is not part of the word it is added to the lettersGuessed array.
     * @param {String} char
     *  The letter to be compared to the current game word.
     */
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
                if (myGame.getDisplayWord().indexOf(char) === -1) myGame.playSound("ding");
                myGame.setDisplayWord(myGame.addChars(newChars));
            }
        }
        if (!match) myGame.addLetterGuessed(char);
    }
    /**
     * Adds the last guessed letter to the current display word.
     * @param {String} char
     *  The letter to be added to the display word.
     * @return {String} newDisplayWord
     *  The new word to be displayed to the user.
     */
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
    /** Calls the constructor for the game object. */
    myGame.newGame();
    // Listener for keyup event.
    document.addEventListener("keyup", function(e) {
        var letter = String.fromCharCode(e.keyCode).toLowerCase();
        userGuessInput.value = letter;
        if (e.keyCode >= 65 && e.keyCode <= 90 && customCategoryInput != document.activeElement) myGame.checkChar(letter);
    }, false);
    // Listener for the radio buttons when clicked.
    for (var i = 0; i < radioButtons.length; i++) {
        radioButtons[i].addEventListener("click", function() {
            myGame.newGame();
            customCategoryInput.value = '';
        }, false);
    }
    // Listener for the custom category input field when clicked on.
    customCategoryInput.addEventListener("click", function() {
        myGame.deselectRadioButtons();
    }, false);
    // Listener for the new word button when clicked on.
    newWordButton.addEventListener("click", function() {
        myGame.generateWord();
    }, false);
    // Listener for the game won animation end to start a new game.
    gameWon.addEventListener("animationend", function() {
        gameWon.className = '';
        myGame.newGame();
    }, false);
    // Listener for the game lost animation end to start a new game.
    gameLost.addEventListener("animationend", function() {
        gameLost.className = '';
        myGame.newGame();
    }, false);
}