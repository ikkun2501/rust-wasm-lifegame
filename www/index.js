import {Cell, Universe} from "wasm-game-of-life";
import {memory} from "wasm-game-of-life/wasm_game_of_life_bg";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
const GRID_SIZE = 1;

const universe = Universe.new();
const width = universe.width();
const height = universe.height();

const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + GRID_SIZE) * height + GRID_SIZE;
canvas.width = (CELL_SIZE + GRID_SIZE) * width + GRID_SIZE;

const ctx = canvas.getContext('2d');

const renderLoop = () => {
    universe.tick();

    drawCells();

    requestAnimationFrame(renderLoop);
};


const drawGrid = () => {
    // 初期化
    ctx.beginPath();
    // GRIDの色を指定
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
        // 開始座標を指定
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        // 座標を指定してラインを引く
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
        // 開始座標を指定
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        // 座標を指定してラインを引く
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }
    // 線を引く
    ctx.stroke();
};


const getIndex = (row, column) => {
    return row * width + column;
};

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);

            // 塗りつぶしのスタイルを設定
            ctx.fillStyle = cells[idx] === Cell.Dead
                ? DEAD_COLOR
                : ALIVE_COLOR;

            // ■を塗りつぶす
            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
};

// GRIDを描画
drawGrid();
// ライフゲームを描画
renderLoop();