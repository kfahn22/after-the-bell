// These sketches generate tiles and then runs the wave function collapse algorithm.
// The code is based on the Wave Function Collapse challenge by Dan Shiffman and 
// Local Storage by Dan Shiffman
// The tile generation code uses shaders and is my own but incorporates SDF functions // from Inigo Quilez
// Attempt to add track choice efficiently

new p5(cg => { // This sketch generates train track tiles that can be used with the wave function collapse algorithm
    // Colors can be personalized by changing the color values in the frag files

    // a shader variable
    let radio1;
    let radio2;
    let radio3;
    let radio4;
    let basicShader;
    let button0;
    let button1;
    let button2;
    let button3;
    let button4;
    let button5;
    let button6;
    let button7;

    let canvas;

    cg.preload = () => {
        // load the the shader
        circleShader = cg.loadShader('circles/basic.vert', 'circles/basic.frag');
        //circleShader2 = cg.loadShader('circles/basic.vert', 'circles/basic2.frag');
    }

    cg.setup = () => {
        cg.pixelDensity(1);
        // shaders require WEBGL mode to work
        // tg.canvas = cg.createCanvas(100, 100, tg.WEBGL);
        cg.createP('Choose your tile and colors');
        let div0 = cg.createDiv();
        div0.position(20,450);
     

        canvas = cg.createCanvas(400, 100, cg.WEBGL);
        canvas.parent(div0);
        canvas.style('padding', '1vw');

        //cg.canvas = cg.createGraphics(100, 100, cg.WEBGL);
        fb = cg.createGraphics(100, 100, cg.WEBGL);
        sb = cg.createGraphics(100, 100, cg.WEBGL );
        tb = cg.createGraphics(100, 100, cg.WEBGL);
        fb = cg.createGraphics(100, 100, cg.WEBGL);
        cg.noStroke();
        div5 = cg.createDiv();

        button0 = cg.createButton('Save blank');
        //div5.parent('div0');
        //div5.class('buttons');
        button0.parent(div5);
        
        //div5.position(20, 480);
        
        button0.mousePressed(cg.saveTile0);
        button1 = cg.createButton('Save half circle');
        button1.parent(div5);
        button1.mousePressed(cg.saveTile1);
        button2 = cg.createButton('Save lens');
        button2.parent(div5);
        button2.mousePressed(cg.saveTile2);
        button3 = cg.createButton('Save column');
        button3.parent(div5);
        button3.mousePressed(cg.saveTile3);
        div6 = cg.createDiv();
        //div6.position(20, 540);
        div6.style('display', "flex");
        div6.style('justify-content', 'space-around');
        button4 = cg.createButton('Save diamond');
        button4.parent(div6);
        button4.mousePressed(cg.saveTile4);
        button5 = cg.createButton('Save junction');
        button5.parent(div6);
        button5.mousePressed(cg.saveTile5);
        button6 = cg.createButton('Save cross');
        button6.parent(div6);
        button6.mousePressed(cg.saveTile6);

        // let div1 = cg.createDiv();
        // div1.style('font-size', '14px');
        // div1.position(20, 575);
        // rad1label = cg.createP('Shape Choice');
        // rad1label.parent(div1);
        // radio1 = cg.createRadio();
        // radio1.parent(div1);
        // radio1.class('choice');
        // radio1.style('width', '75px');
        // radio1.option('0.0', 'blank<br>');
        // radio1.option('1.0', 'half circle<br>');
        // radio1.option('2.0', 'lens<br>');
        // radio1.option('3.0', 'column<br>');
        // radio1.option('4.0', 'diamond<br>');
        // radio1.option('5.0', 'junction<br>');
        // radio1.option('6.0', 'cross<br>');
        // // radio1.option('7.0', 'small<br>');
        // radio1.selected('0.0', 'blank');
        // radio1.attribute('name', 'div1');

        // let div2 = cg.createDiv();
        // div2.style('font-size', '14px');
        // div2.position(120, 575);
        // rad2label = cg.createP('Shape Choice');
        // rad2label.parent(div2);
        // radio2 = cg.createRadio();
        // radio2.parent(div1);
        // radio2.class('choice');
        // radio2.style('width', '75px');
        // radio2.option('0.0', 'blank<br>');
        // radio2.option('1.0', 'half circle<br>');
        // radio2.option('2.0', 'lens<br>');
        // radio2.option('3.0', 'column<br>');
        // radio2.option('4.0', 'diamond<br>');
        // radio2.option('5.0', 'junction<br>');
        // radio2.option('6.0', 'cross<br>');
        // // radio1.option('7.0', 'small<br>');
        // radio2.selected('6.0', 'cross');
        // radio2.attribute('name', 'div2');

        let div1 = cg.createDiv();
        div1.style('font-size', '14px');
        div1.position(20, 575);
        rad1label = cg.createP('Background');
        rad1label.parent(div1);
        radio1 = cg.createRadio();
        radio1.style('width', '75px');
        radio1.parent(div1);
        radio1.option('0.0', 'white<br>');
        radio1.option('1.0', 'black<br>');
        radio1.option('2.0', 'grey<br>');
        radio1.option('3.0', 'red<br>');
        radio1.option('4.0', 'orange<br>');
        radio1.option('5.0', 'yellow<br>');
        radio1.option('6.0', 'green<br>');
        radio1.option('7.0', 'blue<br>');
        radio1.option('8.0', 'violet<br>');
        radio1.selected('2.0', 'grey<br>');
        radio1.attribute('name', 'div1');

        let div2 = cg.createDiv();
        div2.style('font-size', '14px');
        div2.position(120, 575);
        rad2label = cg.createP('Shape color');
        rad2label.parent(div2);
        radio2 = cg.createRadio();
        radio2.parent(div2);
        radio2.style('width', '75px');
        radio2.option('0.0', 'white<br>');
        radio2.option('1.0', 'black<br>');
        radio2.option('2.0', 'grey<br>');
        radio2.option('3.0', 'red<br>');
        radio2.option('4.0', 'orange<br>');
        radio2.option('5.0', 'yellow<br>');
        radio2.option('6.0', 'green<br>');
        radio2.option('7.0', 'blue<br>');
        radio2.option('8.0', 'violet<br>');
        radio2.selected('0.0', 'white<br>');
        radio2.attribute('name', 'div2');

    }
    cg.draw = () => {
        // let shape = radio1.value();
        let col1 = radio1.value();
        let col2 = radio2.value();
       
        cg.drawFirstBuffer(col1);
        cg.drawSecondBuffer(col1,col2);
        // cg.drawThirdBuffer(col1,col2);
        // cg.drawFourthBuffer(col1,col2);
        cg.image(fb, 0, 0);
        cg.image(sb, 100, 0)
        // cg.image(thirdBuffer, 200, 0);
        // cg.image(fourthBuffer, 300, 0);
        // cg.background(0);
       
    }

    cg.drawFirstBuffer = (col1) => {
        circleShader.setUniform('u_resolution', [cg.width, cg.height]);
        circleShader.setUniform('bkcolor', col1);
        circleShader.setUniform('shapecolor', col1);
        circleShader.setUniform('shapechoice', 0.0);
        fb.shader(circleShader);
        fb.rect(0, 0, fb.width, fb.height);
    }

    cg.drawSecondBuffer = (col1,col2) => {
        circleShader.setUniform('u_resolution', [cg.width, cg.height]);
        circleShader.setUniform('bkcolor', col1);
        circleShader.setUniform('shapecolor', col2);
        circleShader.setUniform('shapechoice', 4.0);
        sb.shader(circleShader);
        sb.rect(0,0, sb.width, sb.height);
    }

    cg.drawThirdBuffer = (col1,col2) => {
        circleShader.setUniform('u_resolution', [cg.width, cg.height]);
        circleShader.setUniform('bkcolor', col1);
        circleShader.setUniform('shapecolor', col2);
        circleShader.setUniform('shapechoice', 3.0);
        tb.shader(circleShader);
        tb.rect(0,0,tb.width,tb.height);
    }

    // cg.drawFourthBuffer = (col1,col2) => {
    //     circleShader.setUniform('u_resolution', [cg.width, cg.height]);
    //     circleShader.setUniform('bkcolor', col1);
    //     circleShader.setUniform('shapecolor', col2);
    //     circleShader.setUniform('shapechoice', 1.0);
    //     fourthBuffer.shader(circleShader);
    //     fourthBuffer.rect(0,0,100,100);
    // }

    // tg.buttton = () => {
    //     tg.storeItem("canvas", tg.canvas.elt.toDataURL());
    // }

    cg.saveTile0 = () => {
        cg.storeItem( "img0", fb.elt.toDataURL() );
    }
    // cg.saveTile1 = () => {
    //     cg.storeItem("img1", secondBuffer.elt.toDataURL());
    // }
    // cg.saveTile3 = () => {
    //     cg.storeItem("img2", thirdBuffer.elt.toDataURL());
    // }
    // cg.saveTile4 = () => {
    //     cg.storeItem("img3", fourthBuffer.elt.toDataURL());
    // }

    // tg.buttton = () => {
    //     tg.storeItem("canvas", tg.canvas.elt.toDataURL());
    // }


});


new p5(wfc => {
    //let g;

    // Code for inputing new tiles
    let w = 100;
    let h = 100;

    const tiles = [];
    const tileImages = [];

    let grid = [];

    const DIM = 10;
    let graphics;

    wfc.preload = () => {
        for (let i = 0; i < 7; i++) {

            const path = "train_track_generator/big_tracks";
            tileImages[i] = wfc.loadImage(`${path}/${i}.png`);
        }
    }

    wfc.setup = () => {
        wfc.createCanvas(300, 300);

        //for (let k = 0; k < 7; k++) {
        // graphics = wfc.createGraphics(100, 100);
        // let imgData = wfc.getItem('img${k}');
        // if (imgData !== null) {
        //     console.log(imgData);
        //     tileImages[k] = graphics.loadImage(imgData); //, function (newtile) {
        //wfc.image(newtile, 0, 0, 100, 100);
        // tileImages[0] = graphics.loadImage(imgData, function (newtile) {
        //     wfc.image(newtile, 0, 0, 100, 100);
        //});

        // for (let i = 0; i < tileCanvas.width; i++) {
        //     for (let j = 0; j < tileCanvas.length; j++) {
        //         let x = i * w;
        //         let y = j * h;
        //         let img = wfc.createImage(w, h);
        //         tileImages[k] = img.copy(tileCanvas, x, y, w, h, 0, 0, w, h);
        //     }
        // }
        // } else {
        // Load and code the tiles
        tiles[0] = new Tile(tileImages[0], ["AAA", "AAA", "AAA", "AAA"]);
        tiles[1] = new Tile(tileImages[1], ["ABA", "AAA", "ABA", "AAA"]);
        tiles[2] = new Tile(tileImages[2], ["BAA", "AAB", "AAA", "AAA"]);
        tiles[3] = new Tile(tileImages[3], ["BAA", "AAA", "AAB", "AAA"]);
        tiles[4] = new Tile(tileImages[4], ["ABA", "ABA", "ABA", "ABA"]);
        tiles[5] = new Tile(tileImages[5], ["ABA", "ABA", "ABA", "AAA"]);
        tiles[6] = new Tile(tileImages[6], ["ABA", "ABA", "AAA", "AAA"]);
        //}


        for (let i = 0; i < 7; i++) {
            for (let j = 1; j < 4; j++) {
                tiles.push(tiles[i].rotate(j));
            }
        }

        // Generate the adjacency rules based on edges
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            tile.analyze(tiles);
        }

        wfc.startOver();
    }
    //}

    wfc.startOver = () => {
        // Create cell for each spot on the grid
        for (let i = 0; i < DIM * DIM; i++) {
            grid[i] = new Cell(tiles.length);
        }

    }

    wfc.checkValid = (arr, valid) => {
        //console.log(arr, valid);
        for (let i = arr.length - 1; i >= 0; i--) {
            // VALID: [BLANK, RIGHT]
            // ARR: [BLANK, UP, RIGHT, DOWN, LEFT]
            // result in removing UP, DOWN, LEFT
            let element = arr[i];
            // console.log(element, valid.includes(element));
            if (!valid.includes(element)) {
                arr.splice(i, 1);
            }
        }
        // console.log(arr);
        // console.log("----------");
    }

    wfc.mousePressed = () => {
        wfc.redraw();
    }

    wfc.draw = () => {
        wfc.background(0);

        const w = wfc.width / DIM;
        const h = wfc.height / DIM;
        for (let j = 0; j < DIM; j++) {
            for (let i = 0; i < DIM; i++) {
                let cell = grid[i + j * DIM];
                if (cell.collapsed) {
                    let index = cell.options[0];
                    wfc.image(tiles[index].img, i * w, j * h, w, h);
                } else {
                    wfc.fill(0);
                    wfc.stroke(255);
                    wfc.rect(i * w, j * h, w, h);
                }
            }
        }

        // Pick cell with least entropy
        let gridCopy = grid.slice();
        gridCopy = gridCopy.filter((a) => !a.collapsed);
        // console.table(grid);
        // console.table(gridCopy);

        if (gridCopy.length == 0) {
            return;
        }
        gridCopy.sort((a, b) => {
            return a.options.length - b.options.length;
        });

        let len = gridCopy[0].options.length;
        let stopIndex = 0;
        for (let i = 1; i < gridCopy.length; i++) {
            if (gridCopy[i].options.length > len) {
                stopIndex = i;
                break;
            }
        }

        if (stopIndex > 0) gridCopy.splice(stopIndex);
        const cell = wfc.random(gridCopy);
        cell.collapsed = true;
        const pick = wfc.random(cell.options);
        if (pick === undefined) {
            wfc.startOver();
            return;
        }
        cell.options = [pick];

        const nextGrid = [];
        for (let j = 0; j < DIM; j++) {
            for (let i = 0; i < DIM; i++) {
                let index = i + j * DIM;
                if (grid[index].collapsed) {
                    nextGrid[index] = grid[index];
                } else {
                    let options = new Array(tiles.length).fill(0).map((x, i) => i);
                    // Look up
                    if (j > 0) {
                        let up = grid[i + (j - 1) * DIM];
                        let validOptions = [];
                        for (let option of up.options) {
                            let valid = tiles[option].down;
                            validOptions = validOptions.concat(valid);
                        }
                        wfc.checkValid(options, validOptions);
                    }
                    // Look right
                    if (i < DIM - 1) {
                        let right = grid[i + 1 + j * DIM];
                        let validOptions = [];
                        for (let option of right.options) {
                            let valid = tiles[option].left;
                            validOptions = validOptions.concat(valid);
                        }
                        wfc.checkValid(options, validOptions);
                    }
                    // Look down
                    if (j < DIM - 1) {
                        let down = grid[i + (j + 1) * DIM];
                        let validOptions = [];
                        for (let option of down.options) {
                            let valid = tiles[option].up;
                            validOptions = validOptions.concat(valid);
                        }
                        wfc.checkValid(options, validOptions);
                    }
                    // Look left
                    if (i > 0) {
                        let left = grid[i - 1 + j * DIM];
                        let validOptions = [];
                        for (let option of left.options) {
                            let valid = tiles[option].right;
                            validOptions = validOptions.concat(valid);
                        }
                        wfc.checkValid(options, validOptions);
                    }

                    // I could immediately collapse if only one option left?
                    nextGrid[index] = new Cell(options);
                }
            }
        }

        grid = nextGrid;
    }

    wfc.reverseString = (s) => {
        let arr = s.split("");
        arr = arr.reverse();
        return arr.join("");
    }

    wfc.compareEdge = (a, b) => {
        return a == wfc.reverseString(b);
    }

    class Tile {
        constructor(img, edges) {
            this.img = img;
            this.edges = edges;
            this.up = [];
            this.right = [];
            this.down = [];
            this.left = [];
        }

        analyze(tiles) {
            for (let i = 0; i < tiles.length; i++) {
                let tile = tiles[i];
                // UP
                if (wfc.compareEdge(tile.edges[2], this.edges[0])) {
                    this.up.push(i);
                }
                // RIGHT
                if (wfc.compareEdge(tile.edges[3], this.edges[1])) {
                    this.right.push(i);
                }
                // DOWN
                if (wfc.compareEdge(tile.edges[0], this.edges[2])) {
                    this.down.push(i);
                }
                // LEFT
                if (wfc.compareEdge(tile.edges[1], this.edges[3])) {
                    this.left.push(i);
                }
            }
        }

        rotate(num) {
            const w = this.img.width;
            const h = this.img.height;
            const newImg = wfc.createGraphics(w, h);
            newImg.imageMode(wfc.CENTER);
            newImg.translate(w / 2, h / 2);
            newImg.rotate(wfc.HALF_PI * num);
            newImg.image(this.img, 0, 0);

            const newEdges = [];
            const len = this.edges.length;
            for (let i = 0; i < len; i++) {
                newEdges[i] = this.edges[(i - num + len) % len];
            }
            return new Tile(newImg, newEdges);
        }
    }

    class Cell {
        constructor(value) {
            this.collapsed = false;
            if (value instanceof Array) {
                this.options = value;
            } else {
                this.options = [];
                for (let i = 0; i < value; i++) {
                    this.options[i] = i;
                }
            }
        }
    }

});