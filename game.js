var Game = {
    deck: [],
    startTime: null,
    matchesFound: 0,
    soundOver: null,
    soundActive: null,
    soundBell: null
};

function createDeck() {
    return [
        'J1', 'J1',
        'Q1', 'Q1',
        'K1', 'K1',
        'J2', 'J2',
        'Q2', 'Q2',
        'K2', 'K2',
    ];
}

$(function() {
    initializeGame();

    function initializeGame() {
        console.log("Initializing game...");
        Game.deck = createDeck(); // Create a new deck
        // Shuffle the deck
        Game.deck.sort(() => 0.5 - Math.random());
        Game.startTime = new Date();
        Game.matchesFound = 0;

        // Remove all existing cards
        $('#cards').empty();

        // Add new cards
        for (var i = 0; i < 12; i++) {
            var card = $('<div class="card"><div class="face front"></div><div class="face back"></div></div>');
            $('#cards').append(card);
        }

        $('#cards').children().each(function(index) {
            $(this).removeClass('flipped removed');
            $(this).css({
                "left": ($(this).width() + 20) * (index % 4),
                "top": ($(this).height() + 20) * Math.floor(index / 4)
            });
            var pattern = Game.deck.pop();
            $(this).find('.back').removeClass().addClass(`face back ${pattern}`);
            $(this).attr('data-pattern', pattern);
            $(this).off('click').click(clickCard);
        });

        // Initialize sounds
        Game.soundOver = document.getElementById('soundOver');
        Game.soundOver.volume = .4;
        Game.soundActive = document.getElementById('soundActive');
        Game.soundActive.volume = .4;
        Game.soundBell = document.getElementById('soundBell'); // Initialize bell sound

        $('.card').hover(function() {
            Game.soundOver.currentTime = 0;
            Game.soundOver.play();
        }, function() {
            Game.soundOver.pause();
        }).click(function() {
            Game.soundActive.currentTime = 0;
            Game.soundActive.play();
        });
    }

    function clickCard() {
        // If more than 2 cards are flipped, do nothing
        if ($('.flipped').length > 1) {
            return;
        }

        // Flip the card
        $(this).addClass('flipped');
        
        // If the second card is flipped, check for a match
        if ($('.flipped').length === 2) {
            setTimeout(checkPattern, 500);
        }
    }

    function checkPattern() {
        if (isMatch()) {
            // Move matched cards to 'removed' class
            $('.flipped').removeClass('flipped').addClass('removed');
            // Remove matched cards from DOM after transition
            $('.removed').bind("webkitTransitionEnd", removeMatched);
            Game.matchesFound++;
            console.log(`Match found! Total matches: ${Game.matchesFound}`);
            if (Game.matchesFound === 6) { // Fixed number of matches
                endGame();
            }
        } else {
            $('.flipped').removeClass('flipped');
        }
    }

    function isMatch() {
        var flippedCards = $('.flipped');
        var pattern0 = $(flippedCards[0]).data('pattern');
        var pattern1 = $(flippedCards[1]).data('pattern');
        return (pattern0 === pattern1);
    }

    function removeMatched() {
        $('.removed').remove();
    }

    function endGame() {
        console.log("Game over - ending game...");
        let endTime = new Date();
        let timeTaken = Math.floor((endTime - Game.startTime) / 1000);
        displayPopup(timeTaken);
    }

    function displayPopup(timeTaken) {
        Game.soundBell.currentTime = 0;
        Game.soundBell.play(); // Play the bell sound when the popup appears

        let popup = $('<div id="gamePopup"><h2>Game Over!</h2><p>You did it in: ' + timeTaken + ' seconds</p><button id="okButton">Play Again</button></div>');
        let overlay = $('<div id="gameOverlay"></div>');
        $('body').append(overlay).append(popup);

        console.log("Popup and overlay added to body");

        $('#gameOverlay').css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'background': 'rgba(0,0,0,0.5)',
            'z-index': '100',
            'pointer-events': 'none'
        });

        $('#gamePopup').css({
            'position': 'fixed',
            'top': '50%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
            'background': '#fff',
            'padding': '20px',
            'border-radius': '10px',
            'z-index': '101',
            'text-align': 'center',
            'color': '#000', // Ensure text color is solid black
            'font-weight': 'bold' // Make text bolder for better readability
        });

        $('#gamePopup h2').css({
            'margin': '10px 0',
            'font-size': '24px', // Increase font size for better visibility
            'color': '#000' // Ensure text color is solid black
        });

        $('#gamePopup p').css({
            'margin': '10px 0',
            'font-size': '18px', // Increase font size for better visibility
            'color': '#000' // Ensure text color is solid black
        });

        console.log("Popup and overlay CSS applied");

        $('#okButton').click(function() {
            $('#gamePopup').remove();
            $('#gameOverlay').remove();
            initializeGame();
        });

        console.log("OK button click event assigned");
    }
});
