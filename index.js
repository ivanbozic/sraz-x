window.PLAYERS = {
    red: {
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

window.addEventListener('load', () => {
    window.BOARD = document.getElementById("board");

    generateTiles(8, 8);
    plantFlags();
    positionPlayers();
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

function positionPlayers () {
    for (const property in window.PLAYERS.red.pieces) {
        console.log(`${window.PLAYERS.red.pieces[property].position}`);
        const tile = document.getElementById(`tile-${window.PLAYERS.red.pieces[property].position}`);

        const piece = document.createElement("div");
        piece.classList.add("piece");
        piece.dataset.color = "red";
        piece.dataset.type = "pawn";

        tile.appendChild(piece);
    }

    for (const property in window.PLAYERS.black.pieces) {
        console.log(`${window.PLAYERS.black.pieces[property].position}`);
        const tile = document.getElementById(`tile-${window.PLAYERS.black.pieces[property].position}`);

        const piece = document.createElement("div");
        piece.classList.add("piece");
        piece.dataset.color = "black";
        piece.dataset.type = "pawn";

        tile.appendChild(piece);
    }

    for (const property in window.PLAYERS.green.pieces) {
        console.log(`${window.PLAYERS.green.pieces[property].position}`);
        const tile = document.getElementById(`tile-${window.PLAYERS.green.pieces[property].position}`);

        const piece = document.createElement("div");
        piece.classList.add("piece");
        piece.dataset.color = "green";
        piece.dataset.type = "pawn";

        tile.appendChild(piece);
    }

    for (const property in window.PLAYERS.blue.pieces) {
        console.log(`${window.PLAYERS.blue.pieces[property].position}`);
        const tile = document.getElementById(`tile-${window.PLAYERS.blue.pieces[property].position}`);

        const piece = document.createElement("div");
        piece.classList.add("piece");
        piece.dataset.color = "blue";
        piece.dataset.type = "pawn";

        tile.appendChild(piece);
    }
}