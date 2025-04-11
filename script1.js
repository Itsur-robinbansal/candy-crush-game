document.addEventListener("DOMContentLoaded", () => {
    candyCrushGame();
});

function candyCrushGame() {
    const grid = document.querySelector(".grid");
    const scoreDisplay = document.getElementById("score");
    const width = 8;
    const squares = [];
    let score = 0;

    const candyColors = {
        red: {
            normal: "url('images/red.png')",
            stripedH: "url('images/Redstripeh.png')",
            stripedV: "url('images/Redstripev.png')",
        },
        blue: {
            normal: "url('images/blue.png')",
            stripedH: "url('images/bluestripeh.png')",
            stripedV: "url('images/bluestripev.png')",
        },
        green: {
            normal: "url('images/green.png')",
            stripedH: "url('images/Greenstripeh.png')",
            stripedV: "url('images/GreenstripV.png')",
        },
        yellow: {
            normal: "url('images/yellow.png')",
            stripedH: "url('images/Yellowstripeh.png')",
            stripedV: "url('images/Yellowstripev.png')",
        },
        orange: {
            normal: "url('images/orange.png')",
            stripedH: "url('images/Orangestripeh.png')",
            stripedV: "url('images/Orangestripev.png')",
        },
        purple: {
            normal: "url('images/purple.png')",
            stripedH: "url('images/Purplestripeh.png')",
            stripedV: "url('images/Purplestripev.png')",
        }
    };

    const candyKeys = Object.keys(candyColors);
    const normalCandyImages = candyKeys.map(color => candyColors[color].normal);

    function getColorNameFromImage(imageUrl) {
        const cleanUrl = imageUrl.replace(/['"]/g, "");
    
        for (const color of candyKeys) {
            const colorData = candyColors[color];
            if (
                colorData.normal.replace(/['"]/g, "") === cleanUrl ||
                colorData.stripedH.replace(/['"]/g, "") === cleanUrl ||
                colorData.stripedV.replace(/['"]/g, "") === cleanUrl
            ) {
                return color;
            }
        }
        return null;
    }
    
    
    function getColorTypeFromImage(imageUrl) {
        const cleanUrl = imageUrl.replace(/['"]/g, "");
    
        for (const color of candyKeys) {
            const colorData = candyColors[color];
            if (colorData.normal.replace(/['"]/g, "") === cleanUrl) {
                return { color: color, type: "normal" };
            } else if (colorData.stripedH.replace(/['"]/g, "") === cleanUrl) {
                return { color: color, type: "stripedH" };
            } else if (colorData.stripedV.replace(/['"]/g, "") === cleanUrl) {
                return { color: color, type: "stripedV" };
            }
        }
        return null;
    }
    
    // Creating Game Board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);
            let randomColor = Math.floor(Math.random() * normalCandyImages.length);
            square.style.backgroundImage = normalCandyImages[randomColor];
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
        square.addEventListener("dragleave", dragLeave)
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
        // this.style.backgroundImage = colorBeingDragged;
        // squares[
        //     squareIdBeingDragged
        // ].style.backgroundImage = colorBeingReplaced;
    }

    function dragEnd() {
        //Defining, What is a valid move?
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        // if (squareIdBeingReplaced && validMove) {

        //     squareIdBeingReplaced = null;



        // } else if (squareIdBeingReplaced && !validMove) {
        //     squares[
        //         squareIdBeingReplaced
        //     ].style.backgroundImage = colorBeingReplaced;
        //     squares[
        //         squareIdBeingDragged
        //     ].style.backgroundImage = colorBeingDragged;
        // } else
        //     squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;.

        if (squareIdBeingReplaced && validMove) {
            // Do the swap visually
            let tempColor = squares[squareIdBeingReplaced].style.backgroundImage;
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingDragged;
            squares[squareIdBeingDragged].style.backgroundImage = tempColor;

            // Now check for matches
            const isMatch =
                checkRowForFour() ||
                checkColumnForFour() ||
                checkRowForThree() ||
                checkColumnForThree();

            if (isMatch) {
                scoreDisplay.innerHTML = score;
                squareIdBeingReplaced = null;
            } else {
                // Revert swap
                squares[squareIdBeingReplaced].style.backgroundImage = tempColor;
                squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
            }
        } else {
            // Revert swap if not even a valid position-wise move
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
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
                    let randomColor = Math.floor(Math.random() * normalCandyImages.length);
                    squares[i].style.backgroundImage = normalCandyImages[randomColor];
                }
            }
        }
    }

    ///-> Checking for Matches <-///

    //For Row of Four
    function checkRowForFour() {
        let matchFound = false;
    
        for ( let i = 0; i < 60; i++) {
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
    
            const notValid = [
                5, 6, 7,
                13, 14, 15,
                21, 22, 23,
                29, 30, 31,
                37, 38, 39,
                45, 46, 47,
                53, 54, 55
            ];
            if (notValid.includes(i)) continue;
    
            if (
                rowOfFour.every(index =>
                    squares[index].style.backgroundImage === decidedColor && !isBlank
                )
            ) {
                const colorName = getColorNameFromImage(decidedColor);
    
                rowOfFour.forEach(index => {
                    if (index === squareIdBeingDragged  ) {
                        squares[index].style.backgroundImage = candyColors[colorName].stripedH;
                    } else {
                        squares[index].style.backgroundImage = "";
                    }
                });
    
                score += 4;
                scoreDisplay.innerHTML = score;
                matchFound = true;
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
                columnOfFour.every(index =>
                    squares[index].style.backgroundImage === decidedColor && !isBlank
                )
            ) {
                const colorName = getColorNameFromImage(decidedColor);
    
                columnOfFour.forEach(index => {
                    if (index === squareIdBeingDragged) {
                        squares[index].style.backgroundImage = candyColors[colorName].stripedV;
                    } else {
                        squares[index].style.backgroundImage = "";
                    }
                });
    
                score += 4;
                scoreDisplay.innerHTML = score;
                matchFound = true;
            }
        }
        return matchFound;
    }
    
    checkColumnForFour();


    function clearRow(rowIndex) {
        for (let i = 0; i < width; i++) {
            let idx = rowIndex * width + i;
            squares[idx].style.backgroundImage = "";
            score++;
        }
        scoreDisplay.innerHTML = score;
    }
    
    function clearColumn(colIndex) {
        for (let i = 0; i < width; i++) {
            let idx = colIndex + i * width;
            squares[idx].style.backgroundImage = "";
            score++;
        }
        scoreDisplay.innerHTML = score;
    }
    
    // // 6. Optional: Listen for double-click to activate striped candy
    // squares.forEach((square, index) => {
    //     square.addEventListener('dblclick', () => {
    //         const bg = square.style.backgroundImage;
    //         const color = getColorNameFromImage(bg);
    //         if (!color) return;
    
    //         if (bg === candyColors[color].stripedH) {
    //             clearRow(Math.floor(index / width));
    //         } else if (bg === candyColors[color].stripedV) {
    //             clearColumn(index % width);
    //         }
    //     });
    // });

    //For Row of Three

    const createStripedCandy = (square, color, direction) => {
        const stripedSrc = direction === 'H' 
            ? candyColors[color].stripedH 
            : candyColors[color].stripedV;
    
        // Set the image and alt text
        square.setAttribute("src", stripedSrc);
        square.setAttribute("alt", `${color} striped`);
    };
    
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
            
                rowOfThree.forEach((index) => {
                    const info = getColorTypeFromImage(squares[index].style.backgroundImage);
                    if (info && (info.type === "stripedH" || info.type === "stripedV")) {
                        if (info.type === "stripedH") {
                            clearRow(Math.floor(index / width));
                        } else {
                            clearColumn(index % width);
                        }
                    }
                    squares[index].style.backgroundImage = "";
                });    
                score += 3;
                scoreDisplay.innerHTML = score;
                matchFound = true;
            }
        }
        return matchFound;

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
                score += 3;
                scoreDisplay.innerHTML = score;
                columnOfThree.forEach((index) => {
                    const info = getColorTypeFromImage(squares[index].style.backgroundImage);
                    if (info && (info.type === "stripedH" || info.type === "stripedV")) {
                        if (info.type === "stripedH") {
                            clearRow(Math.floor(index / width));
                        } else {
                            clearColumn(index % width);
                        }
                    }
                    squares[index].style.backgroundImage = "";
                });
                matchFound = true;
            }
        }
        return matchFound;
    }
    checkColumnForThree();


    window.setInterval(function () {
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
        moveIntoSquareBelow();
    }, 100);
}