// These sketches generate tiles and then runs the wave function collapse algorithm.
// The code is based on the Wave Function Collapse challenge by Dan Shiffman and 
// Local Storage by Dan Shiffman
// The tile generation code uses shaders and is my own but incorporates SDF functions // from Inigo Quilez
// Attempt to add track choice efficiently


let circleShader;

preload = () => {
    // load the the shader
    circleShader = loadShader('circles/basic.vert', 'circles/circles.frag');
}

setup = () => {
    pixelDensity(1);
    // shaders require WEBGL mode to work
    c = createCanvas(400, 400, WEBGL);
    noStroke();
}

draw = () => {
    background(0);
    circleShader.setUniform('u_resolution', [width, height]);
    shader(circleShader);
    rect(0, 0, width, height);

}
function mousePressed() {
    saveCanvas(c, '/Users/kathrynfahnline/after-the-bell/tiles/cross/crossTiles/uv.', 'png');
    }