var isAlive = function(currentIndex, $tiles) {
    /* Return true if the cell at currentIndex is alive. */
    return $tiles.eq(currentIndex).hasClass('alive');
};

var neighbours = function(currentIndex, height, width) {
    /* Return a list of indices of all neighbouring tiles. */
    var neighbourList = [];

    var spaceAbove = currentIndex > width - 1;
    var spaceBelow = currentIndex < width * (height - 1);
    var spaceLeft  = currentIndex % width > 0;
    var spaceRight = currentIndex % width < width - 1;

    /* Cardinal directions */
    if (spaceAbove) {
        neighbourList.push(currentIndex - width);
    }

    if (spaceBelow) {
        neighbourList.push(currentIndex + width);
    }

    if (spaceLeft) {
        neighbourList.push(currentIndex - 1);
    }

    if (spaceRight) {
        neighbourList.push(currentIndex + 1);
    }

    /* Diagonals */
    if (spaceAbove && spaceLeft) {
        neighbourList.push(currentIndex - width - 1);
    }

    if (spaceAbove && spaceRight) {
        neighbourList.push(currentIndex - width + 1);
    }

    if (spaceBelow && spaceLeft) {
        neighbourList.push(currentIndex + width - 1);
    }

    if (spaceBelow && spaceRight) {
        neighbourList.push(currentIndex + width + 1);
    }

    return neighbourList;
};

var livingNeighbours = function(currentIndex, cachedNeighbours, $tiles) {
    /* Return the number of living neighbours of a cell. */

    var currentNeighbours = cachedNeighbours[currentIndex];
    var livingCount = 0;

    for (var i = 0; i < currentNeighbours.length; i++) {
        if ($tiles.eq(currentNeighbours[i]).hasClass('alive')) {
            livingCount++;
        }
    }

    return livingCount;
};

var setUpBoard = function($tiles) {

    for (var i = 0; i < $tiles.length; i++) {

        if (Math.random() < 0.4) {
            $tiles.eq(i).addClass('alive');
        }
    }
};

var cacheNeighbours = function($tiles, height, width) {

    var cached = [];

    for (var i = 0; i < $tiles.length; i++) {
        cached.push(neighbours(i, height, width));
    }

    return cached;
};

var nextState = function($tiles, cachedNeighbours) {
    /* Return an array of the next state of the board. */
    var nextBoard = [];

    for (var i = 0; i < $tiles.length; i++) {

        // TODO: FIX THIS.
        var currentLivingNeighbours = livingNeighbours(i, cachedNeighbours, $tiles);

        if (isAlive(i, $tiles)) {

            if (currentLivingNeighbours === 2 || currentLivingNeighbours === 3) {
                nextBoard.push(true);
            } else {
                nextBoard.push(false);
            }
        } else {

            if (currentLivingNeighbours === 3) {
                nextBoard.push(true);
            } else {
                nextBoard.push(false);
            }
        }
    }

    return nextBoard;
};

var updateBoard = function($tiles, cachedNeighbours, $living) {

    var nextBoard = nextState($tiles, cachedNeighbours);
    var living = 0;

    for (var i = 0; i < $tiles.length; i++) {

        if (nextBoard[i]) {
            $tiles.eq(i).addClass('alive');
            living++;
        } else {
            $tiles.eq(i).removeClass('alive');
        }
    }

    $living.text(100*living/$tiles.length + '% alive');
};

var percentageLiving = function($tiles) {
    /* Return the percentage of living cells. */

    var living = 0;

    for (var i = 0; i < $tiles.length; i++) {

        if ($tiles.eq(i).hasClass('alive')) {
            living++;
        }
    }

    return 100 * living / $tiles.length;
};

var updateLivingCounter = function($tiles, $living) {
    /* Update DOM element with number of cells currently alive. */
    $living.text(percentageLiving($tiles) + '% alive');
};

$(document).ready(function() {

    var $tiles = $('.tile');
    var $pause = $('#pause');
    var $clear = $('#clear');
    var $fill = $('#fill');
    var $living = $('#living');

    var $hover = $('#hover');
    var $click = $('#click');

    var height = 10;
    var width = 10;
    var cachedNeighbours = cacheNeighbours($tiles, height, width);

    setUpBoard($tiles, height, width, cachedNeighbours);
    updateLivingCounter($tiles, $living);
    setInterval(function() {
        if (!$pause.hasClass('down')) {
            updateBoard($tiles, cachedNeighbours, $living);
        }
    }, 500);

    $pause.click(function() {

        var $this = $(this);

        $this.toggleClass('down');

        if ($this.hasClass('down')) {
            $this.text('Play');
        } else {
            $this.text('Pause');
        }
    });

    $tiles.mouseenter(function() {
        if ($hover.is(':checked')) {
            $(this).toggleClass('alive');
        }

        updateLivingCounter($tiles, $living);
    });

    $tiles.click(function() {
        if ($click.is(':checked')) {
            $(this).toggleClass('alive');
        }

        updateLivingCounter($tiles, $living);
    });

    $clear.click(function() {
        $tiles.removeClass('alive');
        updateLivingCounter($tiles, $living);
    });

    $fill.click(function() {
        $tiles.addClass('alive');
        updateLivingCounter($tiles, $living);
    })

});