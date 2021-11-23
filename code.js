let mainCanvas = document.getElementById("maincanvas");
mainCanvas.width = 500;
mainCanvas.height = 500;
let mainCTX = mainCanvas.getContext("2d");
let solveButton = document.getElementById("solvebutton");

class Squares{
    constructor(){
        this.array = [];
        for (let i=0; i<9; i++){
            for (let j=0; j<9; j++){
                let square = new Square(i, j, this);
                this.array.push(square);
            }
        }
        this.array.forEach((square)=>{
            square.resetGroups();
        });
        this.columns = [];
        for (let i=0; i<9; i++) {
            let column = [];
            for (let j=0; j<9; j++) {
                column.push(this.array[i*9+j]);
            }
            this.columns.push(column);
        }
        this.rows = [];
        for (let i=0; i<9; i++) {
            let row = [];
            for (let j=0; j<9; j++) {
                row.push(this.array[j*9+i]);
            }
            this.rows.push(row);
        }
        this.groups = [];
        for (let i=0; i<3; i++) {
            for (let j=0; j<3; j++) {
                let group = [];
                for (let k=0; k<3; k++) {
                    for (let l=0; l<3; l++) {
                        group.push(this.array[(i*3+k)*9+j*3+l]);
                    }
                }
                this.groups.push(group);
            }
        }
        this.allGroups = [];
        this.allGroups.push(...this.row, ...this.column, ...this.group);
    }
    update(){
        for (let i=0; i<this.allGroups.length; i++){
            
        }
        this.array.forEach((square)=>{
            square.update();
        });
    }
}

class Square{
    constructor(x, y, squares){
        this.squares = squares;
        this.id = x*9+y;
        this.x = x;
        this.y = y;
        this.value = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        this.row = [];
        this.column = [];
        this.group = [];
        this.allGroups = [];
        this.solveType = "unsolved";
    }
    resetGroups(){
        this.row = [];
        this.column = [];
        this.group = [];
        for (let i=0; i<9; i++) {
            if (this.squares.array[this.x*9+i].id != this.id) {
                this.column.push(this.squares.array[this.x*9+i]);
            }
        }
        for (let i=0; i<9; i++) {
            if (this.squares.array[i*9+this.y].id != this.id) {
                this.row.push(this.squares.array[i*9+this.y]);
            }
        }
        for (let i=0; i<3; i++) {
            for (let j=0; j<3; j++) {
                if (this.squares.array[(Math.floor(this.x/3)*3+i)*9+Math.floor(this.y/3)*3+j].id != this.id) {
                    this.group.push(this.squares.array[(Math.floor(this.x/3)*3+i)*9+Math.floor(this.y/3)*3+j]);
                }
            }
        }
        this.allGroups.push(...this.row, ...this.column, ...this.group);
    }
    drawValue(ctx, canvas){
        if (this.solveType != "unsolved") {
            if (this.solveType == "given") {
                ctx.fillStyle = "#000000";
            } else {
                ctx.fillStyle = "#0000FF";
            }
            ctx.font = "".concat(canvas.height/9)+"px arial"
            ctx.fillText(this.value[0], this.x*canvas.width/9, (this.y+1)*canvas.height/9);
        }
    }
    update(){
        if (this.value.length != 1) {
            let newValue = [];
            this.value.forEach((value)=>{
                let possible = true;
                this.allGroups.forEach((square)=>{
                    if (square.solveType != "unsolved") {
                        if (square.value[0] == value) {
                            possible = false;
                        }
                    }
                });
                if (possible) {
                    newValue.push(value);
                }
            });
            this.value = newValue;
            if (this.value.length == 1) {
                this.solveType = 0;
            }
        }
    }
}

function arrayHas(array, item){
    let hasItem = false;
    let itemPlace = "none";
    for (i=0; i<array.length; i++) {
        if (array[i] == item) {
            hasItem = true;
            itemPlace = i;
        }
    }
    return {hasItem: hasItem, itemPlace: itemPlace};
}

let currentSquares = new Squares();

let selectedSquare = undefined;

function drawSquares(){
    mainCTX.fillStyle = "#FFFFFF";
    mainCTX.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
    mainCTX.fillStyle = "#000000";
    for (let i=1; i<9; i++) {
        if (i%3 == 0) {
            mainCTX.lineWidth = 7;
        } else {
            mainCTX.lineWidth = 2;
        }
        mainCTX.beginPath();
        mainCTX.moveTo(mainCanvas.width*i/9, 0);
        mainCTX.lineTo(mainCanvas.width*i/9, mainCanvas.height);
        mainCTX.stroke();
        mainCTX.beginPath();
        mainCTX.moveTo(0, mainCanvas.height*i/9);
        mainCTX.lineTo(mainCanvas.width, mainCanvas.height*i/9);
        mainCTX.stroke();
    }
    currentSquares.array.forEach((square)=>{
        square.drawValue(mainCTX, mainCanvas);
    });
}

function mainCanvasClicked(event){
    drawSquares();
    let x = Math.floor((event.clientX-mainCanvas.getBoundingClientRect().left)*9/mainCanvas.width);
    let y = Math.floor((event.clientY-mainCanvas.getBoundingClientRect().top)*9/mainCanvas.height);
    mainCTX.fillStyle = "#8080FF";
    mainCTX.fillRect(x*mainCanvas.width/9+2, y*mainCanvas.height/9+2, mainCanvas.width/9-4, mainCanvas.height/9-4);
    selectedSquare = {x: x, y: y};
}
mainCanvas.addEventListener("click", mainCanvasClicked);

drawSquares();

function keyPressed(event){
    if (selectedSquare != undefined) {
        let square = currentSquares.array[selectedSquare.x*9+selectedSquare.y];
        if (event.keyCode == 8) {
            square.value = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            square.solveType = "unsolved";
        } else {
            square.value = [String.fromCharCode(event.keyCode)];
            square.solveType = "given";
        }
        drawSquares();
        selectedSquare = undefined;
    }
}
document.addEventListener("keydown", keyPressed);

function solveButtonClicked(){
    drawSquares();
    selectedSquare = undefined;
    setTimeout(solvingLoop, 2000);
}
solveButton.addEventListener("click", solveButtonClicked);

function solvingLoop(){
    currentSquares.update;
    drawSquares();
    setTimeout(solvingLoop, 1000);
}