window.addEventListener('load', () => {
    window.BOARD = document.getElementById("board");

    generateTiles(8, 8);
});

function generateTiles (width, height) {
    index = 1;

    for (i = 0; i < height; i++) {
        const row = document.createElement("div");
        row.classList.add("row");

        for (j = 0; j < width; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.dataset.index = index;

            row.appendChild(tile);
            index += 1;
        }

        window.BOARD.appendChild(row);
    }
}