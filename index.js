window.DEBUG = true;

window.PLAYERS = {
    red: {
        identifier: "red",
        flag: {
            position: 1
        },
        pieces: {
            R1: {
                position: 17
            },
            R2: {
                position: 9
            },
            R3: {
                position: 10
            },
            R4: {
                position: 2
            },
            R5: {
                position: 3
            }
        }
    },
    black: {
        identifier: "black",
        flag: {
            position: 8
        },
        pieces: {
            K1: {
                position: 24
            },
            K2: {
                position: 16
            },
            K3: {
                position: 15
            },
            K4: {
                position: 7
            },
            K5: {
                position: 6
            }
        }
    },
    green: {
        identifier: "green",
        flag: {
            position: 57
        },
        pieces: {
            G1: {
                position: 41
            },
            G2: {
                position: 49
            },
            G3: {
                position: 50
            },
            G4: {
                position: 58
            },
            G5: {
                position: 59
            }
        }
    },
    blue: {
        identifier: "blue",
        flag: {
            position: 64
        },
        pieces: {
            B1: {
                position: 48
            },
            B2: {
                position: 56
            },
            B3: {
                position: 55
            },
            B4: {
                position: 63
            },
            B5: {
                position: 62
            }
        }
    }
}

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
        setInterval(log, 100);
    }

    generateTiles(8, 8);
    plantFlags();
    positionPieces();
    generateHoles();
    assignCategories();
    setCurrentPlayer("red");

    window.CURRENT_POSITION = window.PLAYERS.red.pieces.R1.position;

    setCurrentPosition();
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
        } else {
            tile.classList.add("tile--active");
            moveTile.classList.add("tile--move");
        }
    }
}

document.onkeydown = function (event) {
    const key = event.key;

    let position = null;
    let tile = getCurrentTile();

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
        if (tile.classList.contains("tile--active") || tile.classList.contains("tile--initial-move-position")) {
            if (window.CURRENT_MODE == "SELECTION") {
                window.CURRENT_MODE = "MOVE";
                window.MOVE_POSITION = position;
            } else if (window.CURRENT_MODE == "MOVE") {
                window.CURRENT_MODE = "SELECTION";
                window.MOVE_POSITION = null;
            }
        } else {
            // TODO Move piece.
        }
    }

    if (window.CURRENT_MODE == "SELECTION") {
        window.CURRENT_POSITION = position;
    } else if (window.CURRENT_MODE == "MOVE") {
        let possibleMoves = [window.CURRENT_POSITION];
        let piece = getPieceByIdentifier(tile.dataset.pieceIdentifier);

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

function log() {
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