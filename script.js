document.addEventListener("DOMContentLoaded", () => {
    candyCrushGame();
});

function candyCrushGame() {
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const width = 8;
    const squares = [];
    let score = 0;

    const candyColors = [
        "url(images/red-candy.png)",
        "url(images/blue-candy.png)",
        "url(images/green-candy.png)",
        "url(images/yellow-candy.png)",
        "url(images/orange-candy.png)",
        "url(images/purple-candy.png)",
    ];

    // \\ add striped versions (horizontal and vertical)


    const stripedCandyHorizontal = {
        "url(images/red-candy.png)": "url(images/redh.png)",
        "url(images/blue-candy.png)": "url(images/blueh.png)",
        "url(images/green-candy.png)": "url(images/greenh.png)",
        "url(images/yellow-candy.png)": "url(images/yellowh.png)",
        "url(images/orange-candy.png)": "url(images/orangeh.png)",
        "url(images/purple-candy.png)": "url(images/purpleh.png)",
    };

    const stripedCandyVertical = {
        "url(images/red-candy.png)": "url(images/redv.png)",
        "url(images/blue-candy.png)": "url(images/bluev.png)",
        "url(images/green-candy.png)": "url(images/greenv.png)",
        "url(images/yellow-candy.png)": "url(images/yellowv.png)",
        "url(images/orange-candy.png)": "url(images/orangev.png)",
        "url(images/purple-candy.png)": "url(images/purplev.png)",
    };

    // Creating Game Board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = candyColors[randomColor];
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    // Dragging the Candy
    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    squares.forEach((square) =>
        square.addEventListener("dragstart", dragStart)
    );
    squares.forEach((square) => square.addEventListener("dragend", dragEnd));
    squares.forEach((square) => square.addEventListener("dragover", dragOver));
    squares.forEach((square) =>
        square.addEventListener("dragenter", dragEnter)
    );
    squares.forEach((square) =>
        square.addEventListener("drageleave", dragLeave)
    );
    squares.forEach((square) => square.addEventListener("drop", dragDrop));

    function dragStart() {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
        // this.style.backgroundImage = ''
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {
        this.style.backgroundImage = "";
    }

    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[
            squareIdBeingDragged
        ].style.backgroundImage = colorBeingReplaced;
    }

    // Add a flag to track if a drag operation is in progress
    let isDragging = false;


    function dragEnd() {
        //Defining, What is a valid move?
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {

            isDragging = true;

            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingDragged;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;

            // Check if the swap created a match
            let matchFound = checkRowForFour() ||
                checkColumnForFour() ||
                checkRowForThree() ||
                checkColumnForThree();

            isDragging = false;

            // If no match was found, revert the swap
            if (!matchFound) {
                squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
                squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
            }
            squareIdBeingReplaced = null;


        } else if (squareIdBeingReplaced && !validMove) {
            squares[
                squareIdBeingReplaced
            ].style.backgroundImage = colorBeingReplaced;
            squares[
                squareIdBeingDragged
            ].style.backgroundImage = colorBeingDragged;
        } else
            squares[
                squareIdBeingDragged
            ].style.backgroundImage = colorBeingDragged;
    }

    //Dropping candies once some have been cleared
    function moveIntoSquareBelow() {
        for (i = 0; i < 55; i++) {
            if (squares[i + width].style.backgroundImage === "") {
                squares[i + width].style.backgroundImage =
                    squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = "";
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                if (isFirstRow && squares[i].style.backgroundImage === "") {
                    let randomColor = Math.floor(
                        Math.random() * candyColors.length
                    );
                    squares[i].style.backgroundImage = candyColors[randomColor];
                }
            }
        }
    }

    ///-> Checking for Matches <-///

    //For Row of Four
    function checkRowForFour() {
        let matchFound = false;

        for (i = 0; i < 60; i++) {
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            const notValid = [
                5,
                6,
                7,
                13,
                14,
                15,
                21,
                22,
                23,
                29,
                30,
                31,
                37,
                38,
                39,
                45,
                46,
                47,
                53,
                54,
                55
            ];
            if (notValid.includes(i)) continue;

            if (
                rowOfFour.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                matchFound = true;
                score += 4;
                scoreDisplay.innerHTML = score;

                // Create horizontal striped candy at the draggedId position if this is from a drag
                if (isDragging && (rowOfFour.includes(squareIdBeingDragged) || rowOfFour.includes(squareIdBeingReplaced))) {
                    // Determine which square to place the striped candy
                    let stripedPosition = squareIdBeingDragged;
                    if (rowOfFour.includes(squareIdBeingReplaced)) {
                        stripedPosition = squareIdBeingReplaced;
                    }

                    // Make sure to clear all except the position for the striped candy
                    rowOfFour.forEach((index) => {
                        if (index !== stripedPosition) {
                            squares[index].style.backgroundImage = "";
                        }
                    });

                    // Place the horizontal striped candy
                    squares[stripedPosition].style.backgroundImage = stripedCandyHorizontal[decidedColor];
                } else {
                    // Clear all candies in the match if not from dragging
                    rowOfFour.forEach((index) => {
                        squares[index].style.backgroundImage = "";
                    });
                }
            }
        }
        return matchFound;
    }
    checkRowForFour();

    //For Column of Four
    function checkColumnForFour() {
        let matchFound = false;
        for (i = 0; i < 39; i++) {
            let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (
                columnOfFour.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                matchFound = true;
                score += 4;
                scoreDisplay.innerHTML = score;

                // Create vertical striped candy at the draggedId position if this is from a drag
                if (isDragging && (columnOfFour.includes(squareIdBeingDragged) || columnOfFour.includes(squareIdBeingReplaced))) {
                    // Determine which square to place the striped candy
                    let stripedPosition = squareIdBeingDragged;
                    if (columnOfFour.includes(squareIdBeingReplaced)) {
                        stripedPosition = squareIdBeingReplaced;
                    }

                    // Make sure to clear all except the position for the striped candy
                    columnOfFour.forEach((index) => {
                        if (index !== stripedPosition) {
                            squares[index].style.backgroundImage = "";
                        }
                    });

                    // Place the vertical striped candy
                    squares[stripedPosition].style.backgroundImage = stripedCandyVertical[decidedColor];
                } else {
                    // Clear all candies in the match if not from dragging
                    columnOfFour.forEach((index) => {
                        squares[index].style.backgroundImage = "";
                    });
                }
            }
        } return matchFound;
    }
    checkColumnForFour();

    //For Row of Three
    function checkRowForThree() {
        let matchFound = false;
        for (i = 0; i < 61; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            const notValid = [
                6,
                7,
                14,
                15,
                22,
                23,
                30,
                31,
                38,
                39,
                46,
                47,
                54,
                55
            ];
            if (notValid.includes(i)) continue;

            if (
                rowOfThree.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                matchFound = true;
                score += 3;
                scoreDisplay.innerHTML = score;
                rowOfThree.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
            }
        } return matchFound;
    }
    checkRowForThree();

    //For Column of Three
    function checkColumnForThree() {
        let matchFound = false;

        for (i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (
                columnOfThree.every(
                    (index) =>
                        squares[index].style.backgroundImage === decidedColor &&
                        !isBlank
                )
            ) {
                score += 3; matchFound = true;

                scoreDisplay.innerHTML = score;
                columnOfThree.forEach((index) => {
                    squares[index].style.backgroundImage = "";
                });
            }
        }
        return matchFound;
    }
    checkColumnForThree();

    // Add function to handle striped candy effects
    function crushCandy() {
        for (let i = 0; i < width * width; i++) {
            const currentCandy = squares[i].style.backgroundImage;

            // Check if this is a horizontal striped candy
            for (let regularCandy in stripedCandyHorizontal) {
                if (currentCandy === stripedCandyHorizontal[regularCandy]) {
                    // Get the row this candy is in
                    const row = Math.floor(i / width);
                    const rowStart = row * width;
                    const rowEnd = rowStart + width;

                    // Clear the entire row
                    for (let j = rowStart; j < rowEnd; j++) {
                        squares[j].style.backgroundImage = "";
                    }

                    // Increase score
                    score += width;
                    scoreDisplay.innerHTML = score;
                    return true;
                }
            }

            // Check if this is a vertical striped candy
            for (let regularCandy in stripedCandyVertical) {
                if (currentCandy === stripedCandyVertical[regularCandy]) {
                    // Clear the entire column
                    for (let j = i % width; j < width * width; j += width) {
                        squares[j].style.backgroundImage = "";
                    }

                    // Increase score
                    score += width;
                    scoreDisplay.innerHTML = score;
                    return true;
                }
            }
        }
        return false;
    }


    window.setInterval(function () {
        crushCandy();
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
        moveIntoSquareBelow();

    }, 100);
}