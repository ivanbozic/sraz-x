window.addEventListener('load', () => {
    window.BOARD = document.getElementById("board");

    generateTiles(8, 8);
});

function generateTiles (width, height) {
    for (i = 0; i < height; i++) {
        const row = document.createElement("div");
        row.classList.add("row");

        for (j = 0; j < width; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");

            row.appendChild(tile);
        }

        window.BOARD.appendChild(row);
    }
}