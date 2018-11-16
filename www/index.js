import {Cell, Universe} from "wasm-game-of-life";
import {memory} from "wasm-game-of-life/wasm_game_of_life_bg";
import * as $ from 'jquery';

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
const GRID_SIZE = 1;


const canvas = document.getElementById("game-of-life-canvas");
const $startBtn = $("#startBtn");
const $stopBtn = $("#stopBtn");
const $resetBtn = $("#resetBtn");
let universe = Universe.new();
let width = universe.width();
let height = universe.height();
canvas.height = (CELL_SIZE + GRID_SIZE) * height + GRID_SIZE;
canvas.width = (CELL_SIZE + GRID_SIZE) * width + GRID_SIZE;

let draw = true;
const ctx = canvas.getContext('2d');

const renderLoop = () => {
    if (draw) {
        universe.tick();
        drawCells();
        // ライフゲームを描画
    }
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

const init = () => {
    universe = Universe.new();
    width = universe.width();
    height = universe.height();
    drawGrid();
    drawCells();
    $stopBtn.click();
}
$(function () {
    // GRIDを描画
    drawGrid();
    drawCells();

    $startBtn.on('click', () => {
        if (draw) {
            renderLoop();
        } else {
            draw = true;
        }
    });

    $stopBtn.on('click', () => {
        draw = false;
    });

    $resetBtn.on('click', () => {
        init();
    })
});

var x = 0;
var y = 0;

function onClick(e) {
    /*
     * rectでcanvasの絶対座標位置を取得し、
     * クリック座標であるe.clientX,e.clientYからその分を引く
     * ※クリック座標はdocumentからの位置を返すため
     * ※rectはスクロール量によって値が変わるので、onClick()内でつど定義
     */
    const rect = e.target.getBoundingClientRect();
    x = Math.floor((Math.round(e.clientX - rect.left)) / (CELL_SIZE + GRID_SIZE));
    y = Math.floor((Math.round(e.clientY - rect.top)) / (CELL_SIZE + GRID_SIZE));
    alert(x + ":" + y)

}


canvas.addEventListener('click', onClick, false);
