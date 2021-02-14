window.DEBUG = true;
window.SOUND = false;

const AudioEngine = new AudioEngineSingleton({
    enabled: window.SOUND
});

window.CURRENT_PLAYER = null;
window.CURRENT_POSITION = null;
window.MOVE_POSITION = null;

// CURRENT_MODE can either be `SELECTION` where the player
// is picking the piece they want to move or `MOVE` where
// the player is choosing where exactly the want to move the
// selected piece.
window.CURRENT_MODE = "SELECTION";

window.addEventListener('load', () => {
    window.BOARD = document.getElementById("board");

    if (window.DEBUG) {
        setInterval(printDebugLog, 100);
    }

    generateTiles(8, 8);
    plantFlags();
    positionPieces();
    generateHoles();
    assignCategories();
    setCurrentPlayer("red");

    window.CURRENT_POSITION = window.PLAYERS.red.pieces.R1.position;

    setCurrentPosition();

    moveToNextPlayerIfPossible();
});

function generateTiles (width, height) {
    index = 1;

    for (i = 0; i < height; i++) {
        const row = document.createElement("div");
        row.classList.add("row");

        for (j = 0; j < width; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.id = `tile-${index}`;

            row.appendChild(tile);
            index += 1;
        }

        window.BOARD.appendChild(row);
    }
}

function plantFlags () {
    document.getElementById(`tile-${window.PLAYERS.red.flag.position}`).classList.add("tile--flag", "flag--red");
    document.getElementById(`tile-${window.PLAYERS.black.flag.position}`).classList.add("tile--flag", "flag--black");
    document.getElementById(`tile-${window.PLAYERS.green.flag.position}`).classList.add("tile--flag", "flag--green");
    document.getElementById(`tile-${window.PLAYERS.blue.flag.position}`).classList.add("tile--flag", "flag--blue");
}

function positionPieces () {
    for (const player in window.PLAYERS) {
        for (const piece in window.PLAYERS[player].pieces) {
            window.PLAYERS[player].pieces[piece].availableMoves = window.PLAYERS[player].pieces[piece].moves;
            positionSinglePiece(window.PLAYERS[player].pieces[piece].position, piece, player);
        }
    }
}

function positionSinglePiece(tileId, pieceIdentifier, pieceColor) {
    const tile = document.getElementById(`tile-${tileId}`);

    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.dataset.color = `${pieceColor}`;
    piece.dataset.type = "pawn";

    tile.appendChild(piece);
    tile.classList.add("tile--piece");
    tile.dataset.pieceIdentifier = pieceIdentifier;
    tile.dataset.pieceColor = pieceColor;
}

function generateHoles () {
    availableTiles = Array.from(document.querySelectorAll(".tile:not(.tile--flag):not(.tile--piece)"));
    availableTiles = availableTiles.sort(() => Math.random() - Math.random()).slice(0, 4);

    for (const tile in availableTiles) {
        availableTiles[tile].classList.add("tile--hole");
    }
}

function assignCategories () {
    categories = ["sports", "history", "geography", "nature", "music", "general", "art", "science", "random"];

    tiles = Array.from(document.querySelectorAll(".tile:not(.tile--flag):not(.tile--hole)"));

    for (const tile in tiles) {
        const category = document.createElement("div");
        category.classList.add("category");
        category.dataset.type = categories[Math.floor(Math.random() * categories.length)];

        tiles[tile].appendChild(category);
    }
}

function setCurrentPlayer(color) {
    window.CURRENT_PLAYER = window.PLAYERS[color];

    document.getElementById("current-player").dataset.player = color;
}

function setCurrentPosition () {
    tiles = document.querySelectorAll(".tile");

    for (i = 0; i < tiles.length; i++) {
        tiles[i].classList.remove("tile--active");
        tiles[i].classList.remove("tile--inactive");
        tiles[i].classList.remove("tile--initial-move-position");
        tiles[i].classList.remove("tile--move");
    }

    if (window.CURRENT_MODE == "SELECTION") {
        // During piece selection, the player can only select their own pieces
        // that have remaining moves. Additionally, the user can only select
        // a piece that is not blocked (i.e. can move) even if it has remaining
        // moves. The player can not select opposing pieces, flags or holes.
        let tile = getCurrentTile();

        if (tile.classList.contains("tile--piece") && window.CURRENT_PLAYER.identifier == tile.dataset.pieceColor) {
            paintPieceProperties(getPieceByIdentifier(tile.dataset.pieceIdentifier));

            AudioEngine.play("tile-active");
        } else {
            clearPieceProperties();

            AudioEngine.play("tile-inactive");
        }

        if (tile.classList.contains("tile--piece") && window.CURRENT_PLAYER.identifier == tile.dataset.pieceColor && canThePieceMove(tile.dataset.pieceIdentifier)) {
            tile.classList.add("tile--active");
        } else {
            tile.classList.add("tile--inactive");
        }
    } else if (window.CURRENT_MODE == "MOVE") {
        let tile = getCurrentTile();
        let moveTile = getCurrentMoveTile();

        if (tile == moveTile) {
            tile.classList.add("tile--initial-move-position");

            AudioEngine.play("tile-active");
        } else {
            tile.classList.add("tile--active");
            moveTile.classList.add("tile--move");

            AudioEngine.play("tile-inactive");
        }
    }
}

document.onkeydown = function (event) {
    const key = event.key;

    let position = null;
    let tile = getCurrentTile();
    let moveTile = getCurrentMoveTile();
    let piece = getPieceByIdentifier(tile.dataset.pieceIdentifier);

    if (window.CURRENT_MODE == "SELECTION") {
        position = window.CURRENT_POSITION;
    } else if (window.CURRENT_MODE == "MOVE") {
        position = window.MOVE_POSITION;
    }

    if (key == "ArrowRight") {
        if (position % 8 != 0) {
            position += 1;
        }
    } else if (key == "ArrowLeft") {
        if (position % 8 != 1) {
            position -= 1;
        }
    } else if (key == "ArrowDown") {
        if (position < 57) {
            position += 8;
        }
    } else if (key == "ArrowUp") {
        if (position > 8) {
            position -= 8;
        }
    } else if (key == "Enter") {
        if (window.CURRENT_MODE == "SELECTION" && tile.classList.contains("tile--active")) {
            window.CURRENT_MODE = "MOVE";
            window.MOVE_POSITION = position;
        } else if (window.CURRENT_MODE == "MOVE") {
            if (!moveTile.classList.contains("tile--initial-move-position")) {
                movePiece(piece, window.MOVE_POSITION);
            }

            window.CURRENT_MODE = "SELECTION";
            window.MOVE_POSITION = null;
        }
    } else {
        return;
    }

    if (window.CURRENT_MODE == "SELECTION") {
        window.CURRENT_POSITION = position;
    } else if (window.CURRENT_MODE == "MOVE") {
        let possibleMoves = [window.CURRENT_POSITION];

        if (window.CURRENT_POSITION % 8 != 1 && canPieceMoveLeft(piece)) possibleMoves.push(window.CURRENT_POSITION - 1);
        if (window.CURRENT_POSITION % 8 != 0 && canPieceMoveRight(piece)) possibleMoves.push(window.CURRENT_POSITION + 1);
        if (window.CURRENT_POSITION > 8 && canPieceMoveUp(piece)) possibleMoves.push(window.CURRENT_POSITION - 8);
        if (window.CURRENT_POSITION < 57 && canPieceMoveDown(piece)) possibleMoves.push(window.CURRENT_POSITION + 8);

        if(possibleMoves.includes(position)) {
            window.MOVE_POSITION = position;
        }
    }

    setCurrentPosition();
}

function nextPlayer () {
    let nextPlayer = calculateNextPlayerInOrder(window.CURRENT_PLAYER.identifier);
    resetCurrentPlayer();
    setCurrentPlayer(nextPlayer);
}

function calculateNextPlayerInOrder(currentPlayer) {
    if (currentPlayer == "red") {
        return "blue";
    } else if (currentPlayer == "blue") {
        return "black";
    } else if (currentPlayer == "black") {
        return "green";
    } else if (currentPlayer == "green") {
        return "red";
    }
}

function canThePieceMove(pieceIdentifier) {
    if (pieceIdentifier) {
        piece = getPieceByIdentifier(pieceIdentifier);

        if (piece.availableMoves == 0) {
            return false;
        }

        // The piece can't move to a different place if there's a hole
        // in that place, if there is another piece there, if the piece
        // is on the edge of the board and is trying to move over the edge,
        // or if the player's flag is occupying the new place.
        canMoveUp = canPieceMoveUp(piece);
        canMoveRight = canPieceMoveRight(piece);
        canMoveDown = canPieceMoveDown(piece);
        canMoveLeft = canPieceMoveLeft(piece);

        return (canMoveUp || canMoveRight || canMoveDown || canMoveLeft);
    } else {
        // Not a piece.
        return false;
    }
}

function getPieceByIdentifier(pieceIdentifier) {
    let piece = null;

    Object.values(window.PLAYERS).filter(p => {
        if (p.pieces[pieceIdentifier]) {
            piece = p.pieces[pieceIdentifier];
            piece.color = p.identifier;
        }
    });

    return piece;
}

function printDebugLog() {
    // Log current mode.
    document.getElementById("log-mode").innerText = window.CURRENT_MODE;

    // Log current position.
    document.getElementById("log-position").innerText = window.CURRENT_POSITION;

    // Log move position.
    if (window.MOVE_POSITION) {
        document.getElementById("log-move-position").innerText = window.MOVE_POSITION;
    } else {
        document.getElementById("log-move-position").innerText = "<NULL>";
    }

    // Log sound enabled / disabled.
    if (window.SOUND) {
        document.getElementById("log-sound").innerText = "<ON>";
    } else {
        document.getElementById("log-sound").innerText = "<OFF>";
    }
}

function getCurrentTile() {
    return document.getElementById(`tile-${window.CURRENT_POSITION}`);
}

function getCurrentMoveTile() {
    if (window.CURRENT_MODE == "MOVE") {
        return document.getElementById(`tile-${window.MOVE_POSITION}`);
    } else {
        return undefined;
    }
}

function canPieceMoveUp(piece) {
    if (piece.position < 9) {
        return false;
    } else {
        let tileAbove = document.getElementById(`tile-${window.CURRENT_POSITION - 8}`);

        if (tileAbove.classList.contains("tile--piece") || tileAbove.classList.contains("tile--hole") || tileAbove.classList.contains(`flag--${piece.color}`)) {
            return false;
        }
    }

    return true;
}

function canPieceMoveRight(piece) {
    if (piece.position % 8 == 0) {
        return false;
    } else {
        let tileToTheRight = document.getElementById(`tile-${window.CURRENT_POSITION + 1}`);

        if (tileToTheRight.classList.contains("tile--piece") || tileToTheRight.classList.contains("tile--hole") || tileToTheRight.classList.contains(`flag--${piece.color}`)) {
            return false;
        }
    }

    return true;
}

function canPieceMoveDown(piece) {
    if (piece.position > 56) {
        return false;
    } else {
        let tileBelow = document.getElementById(`tile-${window.CURRENT_POSITION + 8}`);

        if (tileBelow.classList.contains("tile--piece") || tileBelow.classList.contains("tile--hole") || tileBelow.classList.contains(`flag--${piece.color}`)) {
            return false;
        }
    }

    return true;
}

function canPieceMoveLeft(piece) {
    if (piece.position % 8 == 1) {
        return false;
    } else {
        let tileToTheLeft = document.getElementById(`tile-${window.CURRENT_POSITION - 1}`);

        if (tileToTheLeft.classList.contains("tile--piece") || tileToTheLeft.classList.contains("tile--hole") || tileToTheLeft.classList.contains(`flag--${piece.color}`)) {
            return false;
        }
    }

    return true;
}

function movePiece(piece, newPosition) {
    clearPieceFromTile(piece.position);

    window.PLAYERS[piece.color].pieces[piece.identifier].position = newPosition;
    window.PLAYERS[piece.color].pieces[piece.identifier].availableMoves = piece.moves - 1;

    window.PLAYERS[piece.color].pieces[piece.identifier].level += 1;

    positionSinglePiece(newPosition, piece.identifier, piece.color);

    moveToNextPlayerIfPossible();
}

function clearPieceFromTile(tilePosition) {
    const tile = document.getElementById(`tile-${tilePosition}`);

    tile.classList.remove("tile--piece");
    delete tile.dataset.pieceIdentifier;
    delete tile.dataset.pieceColor;

    tile.removeChild(tile.getElementsByClassName("piece")[0]);
}

function paintPieceProperties(piece) {
    // Render the name of the highlighted piece.
    let identifierContainer = document.getElementById("current-piece-identifier");
    identifierContainer.innerHTML = `${piece.type} ${numberToRomanNumeral(parseInt(piece.identifier.substring(1)))}`;

    // Draw the level of this piece.
    let medalContainer = document.getElementById("current-piece-level");
    medalContainer.innerHTML = null;

    Array(piece.level).fill().map(_ => {
        const medal = document.createElement("img");
        medal.src = "assets/medal.svg";
        medal.alt = "Medal";

        medalContainer.appendChild(medal);
    });

    // Draw how many (remaining) moves does this piece have.
    let movesContainer = document.getElementById("current-piece-moves");
    movesContainer.innerHTML = null;

    Array(piece.availableMoves).fill().map(_ => {
        const boot = document.createElement("img");
        boot.src = "assets/move-boot.svg";
        boot.alt = "Boot";

        movesContainer.appendChild(boot);
    });
}

function clearPieceProperties() {
    let identifierContainer = document.getElementById("current-piece-identifier");
    identifierContainer.innerHTML = null;

    let medalContainer = document.getElementById("current-piece-level");
    medalContainer.innerHTML = null;

    let movesContainer = document.getElementById("current-piece-moves");
    movesContainer.innerHTML = null;
}

function numberToRomanNumeral(integer) {
    // This is not a complete implementation since we are
    // certain that pieces in Sraz will not go above 5.
    if (integer == 1) return "I";
    if (integer == 2) return "II";
    if (integer == 3) return "III";
    if (integer == 4) return "IV";
    if (integer == 5) return "V";
}

function moveToNextPlayerIfPossible() {
    let piecesThatCanMove = 0;

    for (const piece in window.CURRENT_PLAYER.pieces) {
        if(window.CURRENT_PLAYER.pieces[piece].availableMoves > 0) {
            piecesThatCanMove += 1;
        }
    }

    if (piecesThatCanMove == 0) {
        nextPlayer();
    }
}

function resetCurrentPlayer() {
    for (const piece in window.CURRENT_PLAYER.pieces) {
        window.CURRENT_PLAYER.pieces[piece].availableMoves = window.CURRENT_PLAYER.pieces[piece].moves;
    }
}