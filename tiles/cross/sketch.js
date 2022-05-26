// These sketches generate tiles and then runs the wave function collapse algorithm.
// The code is based on the Wave Function Collapse challenge by Dan Shiffman and 
// Local Storage by Dan Shiffman
// The tile generation code uses shaders and is my own but incorporates SDF functions // from Inigo Quilez
// Attempt to add track choice efficiently


let crossShader;

preload = () => {
    // load the the shader
    crossShader = loadShader('circles/basic.vert', 'cross/cross.frag');
}

setup = () => {
    pixelDensity(1);
    // shaders require WEBGL mode to work
    createCanvas(400, 400, WEBGL);
    noStroke();
}

draw = () => {
    background(0);
    crossShader.setUniform('u_resolution', [width, height]);
    shader(crossShader);
    rect(0, 0, width, height);

}
// function mousePressed() {
//     //saveFrames('uv', 'png', 1, 1);
//     saveCanvas(`cross/cross_tiles/${i}`, 'png', 1, 1);
//     }