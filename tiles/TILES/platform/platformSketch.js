// These sketches generate tiles and then runs the wave function collapse algorithm.
// The wfc algorithm code is based on the Wave Function Collapse challenge by Dan Shiffman
// https://www.youtube.com/watch?v=QvoTSl60Y88
// The idea for storing the tiles in local storage is based on the th Local Storage tutorial by Dan Shiffman
// https://www.youtube.com/watch?v=_SRS8b4LcZ8

new p5(sa => {

    // a shader variable
    let shader0;

    // Declare variables
    let radio1;

    let button0;
    let button1;
    let c0;
    let graphics0;

    sa.preload = () => {
        // load the the shader
        shader0 = sa.loadShader('rounded_loops/loops.vert', 'rounded_loops/loops.frag');
    }

    sa.setup = () => {
        sa.pixelDensity(1);
        sa.noStroke();

        let divA = sa.createDiv();
        divA.position(20, 600);
        divA.style('max-width', '100px');
        divA.style('align-content', 'center');

        c0 = sa.createCanvas(100, 100, sa.WEBGL);
        c0.parent(divA);
        sa.pixelDensity(1);
        // shaders require WEBGL mode to work
        graphics0 = sa.createGraphics(100, 100, sa.WEBGL);

        button0 = sa.createButton('SAVE TILE A');
        button0.parent(divA);
        button0.mousePressed(sa.saveTile0);
        

        r1Slider = sa.createSlider(0, 255, 8);
        g1Slider = sa.createSlider(0, 255, 61);
        b1Slider = sa.createSlider(0, 255, 119);
        r2Slider = sa.createSlider(0, 255, 218);
        g2Slider = sa.createSlider(0, 255, 65);
        b2Slider = sa.createSlider(0, 255, 103);

        let colors = sa.getItem("colors");
        if (colors !== null) {
            r1Slider.value(colors.r1);
            g1Slider.value(colors.g1);
            b1Slider.value(colors.b1);
            r2Slider.value(colors.r2);
            g2Slider.value(colors.g2);
            b2Slider.value(colors.b2);
        }
        r1Slider.changed(sa.storeColors);
        g1Slider.changed(sa.storeColors);
        b1Slider.changed(sa.storeColors);
        r2Slider.changed(sa.storeColors);
        g2Slider.changed(sa.storeColors);
        b2Slider.changed(sa.storeColors);

        // Organize the layout
        let div1 = sa.createDiv();
        div1.style('font-size', '16px');
        div1.position(10, 425);
        colAlabel = sa.createP('Color A');
        colAlabel.parent(div1);
        colAlabel.style("color", "#555555");
        r1Slider.parent(div1);
        g1Slider.parent(div1);
        b1Slider.parent(div1);   
         
        let div2 = sa.createDiv();
        div2.style('font-size', '16px');
        div2.position(10, 500);
        colBlabel = sa.createP('Color B');
        colBlabel.parent(div2);
        colBlabel.style("color", "#555555");
        r2Slider.parent(div2);
        g2Slider.parent(div2);
        b2Slider.parent(div2); 
    }

    sa.draw = () => {
        let r1 = r1Slider.value();
        let g1 = g1Slider.value();
        let b1 = b1Slider.value();
        let r2 = r2Slider.value();
        let g2 = g2Slider.value();
        let b2 = b2Slider.value();
        shader0.setUniform('u_resolution', [sa.width, sa.height]);
        shader0.setUniform('colorAr', r1);
        shader0.setUniform('colorAg', g1);
        shader0.setUniform('colorAb', b1);
        shader0.setUniform('colorBr', r2);
        shader0.setUniform('colorBg', g2);
        shader0.setUniform('colorBb', b2);
        shader0.setUniform('tileChoice', 0.0);
        sa.shader(shader0);
        sa.rect(0, 0, sa.width, sa.height);
        // sa.noLoop();
        // sa.saveCanvas(c0, 'dogbone/dogbone_tiles/0.png');
    }

    sa.storeColors = () => {
        let colors = {
            r1: r1Slider.value(),
            g1: g1Slider.value(),
            b1: b1Slider.value(),
            r2: r2Slider.value(),
            g2: g2Slider.value(),
            b2: b2Slider.value(),
        }

        sa.storeItem("colors", colors);
    }

    sa.saveTile = () => {
        sa.saveCanvas(c0, '0.png');
    }

    sa.saveTile0 = () => {
        sa.storeItem("img0", c0.elt.toDataURL());
    }

});

new p5(sb => {
    // a shader variable
    let shader1;
    let button1;
    let c2;
    let graphics2;

    sb.preload = () => {
        // load the the shader
        shader1 = sb.loadShader('rounded_loops/loops.vert', 'rounded_loops/loops.frag');
    }
    
    sb.setup = () => {
        sb.pixelDensity(1);
        sb.noStroke();
        // shaders require WEBGL mode to work

        let divB = sb.createDiv();
        divB.position(125, 600);
        divB.style('max-width', '100px');
        c1 = sb.createCanvas(100, 100, sb.WEBGL);
        c1.parent(divB);
        sb.pixelDensity(1);
        graphics2 = sb.createGraphics(100, 100, sb.WEBGL);

        button1 = sb.createButton('SAVE TILE B');
        button1.mousePressed(sb.saveTile1);
        button1.parent(divB);

        let colors = sb.getItem("colors");
        if (colors !== null) {
            r1Slider.value(colors.r1);
            g1Slider.value(colors.g1);
            b1Slider.value(colors.b1);
            r2Slider.value(colors.r2);
            g2Slider.value(colors.g2);
            b2Slider.value(colors.b2);
        }  
    }

    sb.draw = () => {
        let r1 = r1Slider.value();
        let g1 = g1Slider.value();
        let b1 = b1Slider.value();
        let r2 = r2Slider.value();
        let g2 = g2Slider.value();
        let b2 = b2Slider.value();  
        shader1.setUniform('u_resolution', [sb.width, sb.height]);
        shader1.setUniform('colorAr', r1);
        shader1.setUniform('colorAg', g1);
        shader1.setUniform('colorAb', b1);
        shader1.setUniform('colorBr', r2);
        shader1.setUniform('colorBg', g2);
        shader1.setUniform('colorBb', b2);
        shader1.setUniform('tileChoice', 1.0);
        sb.shader(shader1);
        sb.rect(0, 0, sb.width, sb.height)
    }
 
    sb.saveTile1 = () => {
        sb.storeItem("img1", c1.elt.toDataURL());
    }
});

new p5(sc => {
    // a shader variable
    let shader2;
    let button2;
    let c2;
    let graphics3;

    sc.preload = () => {
        // load the the shader
        shader2 = sc.loadShader('rounded_loops/loops.vert', 'rounded_loops/loops.frag');
    }

    sc.setup = () => {
        sc.pixelDensity(1);
        sc.noStroke();
        // shaders require WEBGL mode to work

        let divC = sc.createDiv();
        divC.position(230, 600);
        divC.style('max-width', '100px');
        c2 = sc.createCanvas(100, 100, sc.WEBGL);
        c2.parent(divC);
        sc.pixelDensity(1);
        graphics3 = sc.createGraphics(100, 100, sc.WEBGL);

        button2 = sc.createButton('SAVE TILE C');
        button2.mousePressed(sc.saveTile2);
        button2.parent(divC);

        let colors = sc.getItem("colors");
        if (colors !== null) {
            r1Slider.value(colors.r1);
            g1Slider.value(colors.g1);
            b1Slider.value(colors.b1);
            r2Slider.value(colors.r2);
            g2Slider.value(colors.g2);
            b2Slider.value(colors.b2);
        }
        
    }

    sc.draw = () => {
        let r1 = r1Slider.value();
        let g1 = g1Slider.value();
        let b1 = b1Slider.value();
        let r2 = r2Slider.value();
        let g2 = g2Slider.value();
        let b2 = b2Slider.value();
        shader2.setUniform('u_resolution', [sc.width, sc.height]);
        shader2.setUniform('colorAr', r1);
        shader2.setUniform('colorAg', g1);
        shader2.setUniform('colorAb', b1);
        shader2.setUniform('colorBr', r2);
        shader2.setUniform('colorBg', g2);
        shader2.setUniform('colorBb', b2);
        shader2.setUniform('tileChoice', 2.0);
        sc.shader(shader2);
        sc.rect(0, 0, sc.width, sc.height)
    }
 
    sc.saveTile2 = () => {
        sc.storeItem("img2", c2.elt.toDataURL());
    }
});

new p5(sd => {
    // a shader variable
    let shader3;
    let button3;
    let c3;
    let graphics3;

    sd.preload = () => {
        // load the the shader
        shader3 = sd.loadShader('rounded_loops/loops.vert', 'rounded_loops/loops.frag');
    }

    sd.setup = () => {
        sd.pixelDensity(1);
        sd.noStroke();
        // shaders require WEBGL mode to work

        let divD = sd.createDiv();
        divD.position(335, 600);
        divD.style('max-width', '100px');
        c3 = sd.createCanvas(100, 100, sd.WEBGL);
        c3.parent(divD);
        sd.pixelDensity(1);
        graphics3 = sd.createGraphics(100, 100, sd.WEBGL);

        button3 = sd.createButton('SAVE TILE D');
        button3.mousePressed(sd.saveTile3);
        button3.parent(divD);

        let colors = sd.getItem("colors");
        if (colors !== null) {
            r1Slider.value(colors.r1);
            g1Slider.value(colors.g1);
            b1Slider.value(colors.b1);
            r2Slider.value(colors.r2);
            g2Slider.value(colors.g2);
            b2Slider.value(colors.b2);
        }
        
    }

    sd.draw = () => {
        let r1 = r1Slider.value();
        let g1 = g1Slider.value();
        let b1 = b1Slider.value();
        let r2 = r2Slider.value();
        let g2 = g2Slider.value();
        let b2 = b2Slider.value();
        shader3.setUniform('u_resolution', [sd.width, sd.height]);
        shader3.setUniform('colorAr', r1);
        shader3.setUniform('colorAg', g1);
        shader3.setUniform('colorAb', b1);
        shader3.setUniform('colorBr', r2);
        shader3.setUniform('colorBg', g2);
        shader3.setUniform('colorBb', b2);
        shader3.setUniform('tileChoice', 3.0);
        sd.shader(shader3);
        sd.rect(0, 0, sd.width, sd.height)
    }
 
    sd.saveTile3 = () => {
        sd.storeItem("img3", c3.elt.toDataURL());
    }
});


new p5(se => {
    // a shader variable
    let shader4;
    let button4;
    let c4;
    let graphics4;

    se.preload = () => {
        // load the the shader
        shader4 = se.loadShader('rounded_loops/loops.vert', 'rounded_loops/loops.frag');
    }

    se.setup = () => {
        se.pixelDensity(1);
        se.noStroke();
        // shaders require WEBGL mode to work

        let divE = se.createDiv();
        divE.position(20, 750);
        divE.style('max-width', '100px');
        c4 = se.createCanvas(100, 100, se.WEBGL);
        c4.parent(divE);
        se.pixelDensity(1);
        graphics4 = se.createGraphics(100, 100, se.WEBGL);

        button4 = se.createButton('SAVE TILE E');
        button4.mousePressed(se.saveTile4);
        button4.parent(divE);

        let colors = se.getItem("colors");
        if (colors !== null) {
            r1Slider.value(colors.r1);
            g1Slider.value(colors.g1);
            b1Slider.value(colors.b1);
            r2Slider.value(colors.r2);
            g2Slider.value(colors.g2);
            b2Slider.value(colors.b2);
        }
        
    }

    se.draw = () => {
        let r1 = r1Slider.value();
        let g1 = g1Slider.value();
        let b1 = b1Slider.value();
        let r2 = r2Slider.value();
        let g2 = g2Slider.value();
        let b2 = b2Slider.value();
        shader4.setUniform('u_resolution', [se.width, se.height]);
        shader4.setUniform('colorAr', r1);
        shader4.setUniform('colorAg', g1);
        shader4.setUniform('colorAb', b1);
        shader4.setUniform('colorBr', r2);
        shader4.setUniform('colorBg', g2);
        shader4.setUniform('colorBb', b2);
        shader4.setUniform('tileChoice', 4.0);
        se.shader(shader4);
        se.rect(0, 0, se.width, se.height)
    }
 
    se.saveTile4 = () => {
        se.storeItem("img4", c4.elt.toDataURL());
    }
});


new p5(sf => {
    // a shader variable
    let shader5;
    let button5;
    let c5;
    let graphics5;

    sf.preload = () => {
        // load the the shader
        shader5 = sf.loadShader('rounded_loops/loops.vert', 'rounded_loops/loops.frag');
    }

    sf.setup = () => {
        sf.pixelDensity(1);
        sf.noStroke();
        // shaders require WEBGL mode to work

        let divF = sf.createDiv();
        divF.position(125, 750);
        divF.style('max-width', '100px');
        c5 = sf.createCanvas(100, 100, sf.WEBGL);
        c5.parent(divF);
        sf.pixelDensity(1);
        graphics5 = sf.createGraphics(100, 100, sf.WEBGL);

        button5 = sf.createButton('SAVE TILE F');
        button5.mousePressed(sf.saveTile5);
        button5.parent(divF);

        let colors = sf.getItem("colors");
        if (colors !== null) {
            r1Slider.value(colors.r1);
            g1Slider.value(colors.g1);
            b1Slider.value(colors.b1);
            r2Slider.value(colors.r2);
            g2Slider.value(colors.g2);
            b2Slider.value(colors.b2);
        }
        
    }

    sf.draw = () => {
        let r1 = r1Slider.value();
        let g1 = g1Slider.value();
        let b1 = b1Slider.value();
        let r2 = r2Slider.value();
        let g2 = g2Slider.value();
        let b2 = b2Slider.value();
        shader5.setUniform('u_resolution', [sf.width, sf.height]);
        shader5.setUniform('colorAr', r1);
        shader5.setUniform('colorAg', g1);
        shader5.setUniform('colorAb', b1);
        shader5.setUniform('colorBr', r2);
        shader5.setUniform('colorBg', g2);
        shader5.setUniform('colorBb', b2);
        shader5.setUniform('tileChoice', 5.0);
        sf.shader(shader5);
        sf.rect(0, 0, sf.width, sf.height)
    }
 
    sf.saveTile5 = () => {
        sf.storeItem("img5", c5.elt.toDataURL());
    }
});

new p5(sg => {
    // a shader variable
    let shader6;
    let button6;
    let c6;
    let graphics6

    sg.preload = () => {
        // load the the shader
        shader6 = sg.loadShader('rounded_loops/loops.vert', 'rounded_loops/loops.frag');
    }

    sg.setup = () => {
        sg.pixelDensity(1);
        sg.noStroke();
        // shaders require WEBGL mode to work

        let divG = sg.createDiv();
        divG.position(230, 750);
        divG.style('max-width', '100px');
        c6 = sg.createCanvas(100, 100, sg.WEBGL);
        c6.parent(divG);
        sg.pixelDensity(1);
        graphics6 = sg.createGraphics(100, 100, sg.WEBGL);

        button6 = sg.createButton('SAVE TILE G');
        button6.mousePressed(sg.saveTile6);
        button6.parent(divG);

        let colors = sg.getItem("colors");
        if (colors !== null) {
            r1Slider.value(colors.r1);
            g1Slider.value(colors.g1);
            b1Slider.value(colors.b1);
            r2Slider.value(colors.r2);
            g2Slider.value(colors.g2);
            b2Slider.value(colors.b2);
        }
        
    }

    sg.draw = () => {
        let r1 = r1Slider.value();
        let g1 = g1Slider.value();
        let b1 = b1Slider.value();
        let r2 = r2Slider.value();
        let g2 = g2Slider.value();
        let b2 = b2Slider.value();
        shader6.setUniform('u_resolution', [sg.width, sg.height]);
        shader6.setUniform('colorAr', r1);
        shader6.setUniform('colorAg', g1);
        shader6.setUniform('colorAb', b1);
        shader6.setUniform('colorBr', r2);
        shader6.setUniform('colorBg', g2);
        shader6.setUniform('colorBb', b2);
        shader6.setUniform('tileChoice', 6.0);
        sg.shader(shader6);
        sg.rect(0, 0, sg.width, sg.height)
    }
 
    sg.saveTile6 = () => {
        sg.storeItem("img6", c6.elt.toDataURL());
    }
});


new p5(sh => {
    // a shader variable
    let shader7;
    let button7;
    let c7;
    let graphics7

    sh.preload = () => {
        // load the the shader
        shader7 = sh.loadShader('rounded_loops/loops.vert', 'rounded_loops/loops.frag');
    }

    sh.setup = () => {
        sh.pixelDensity(1);
        sh.noStroke();
        // shaders require WEBGL mode to work

        let divH = sh.createDiv();
        divH.position(335, 750);
        divH.style('max-width', '100px');
        c7 = sh.createCanvas(100, 100, sh.WEBGL);
        c7.parent(divH);
        sh.pixelDensity(1);
        graphics7 = sh.createGraphics(100, 100, sh.WEBGL);

        button7 = sh.createButton('SAVE TILE H');
        button7.mousePressed(sh.saveTile7);
        button7.parent(divH);

        let colors = sh.getItem("colors");
        if (colors !== null) {
            r1Slider.value(colors.r1);
            g1Slider.value(colors.g1);
            b1Slider.value(colors.b1);
            r2Slider.value(colors.r2);
            g2Slider.value(colors.g2);
            b2Slider.value(colors.b2);
        }
        
    }

    sh.draw = () => {
        let r1 = r1Slider.value();
        let g1 = g1Slider.value();
        let b1 = b1Slider.value();
        let r2 = r2Slider.value();
        let g2 = g2Slider.value();
        let b2 = b2Slider.value();
        shader7.setUniform('u_resolution', [sh.width, sh.height]);
        shader7.setUniform('colorAr', r1);
        shader7.setUniform('colorAg', g1);
        shader7.setUniform('colorAb', b1);
        shader7.setUniform('colorBr', r2);
        shader7.setUniform('colorBg', g2);
        shader7.setUniform('colorBb', b2);
        shader7.setUniform('tileChoice', 7.0);
        sh.shader(shader7);
        sh.rect(0, 0, sh.width, sh.height)
    }
 
    sh.saveTile7 = () => {
        sh.storeItem("img7", c7.elt.toDataURL());
    }
});

