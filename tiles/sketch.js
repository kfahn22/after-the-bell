// This sketch generates tiles that can be used with the wave function collapse algorithm

//${path}/${i}.png
//let textureImg;

let sel;
let rSlider, gSlider, bSlider;
let canvas;

// a shader variable
let circleShader;
let flowerShader;
let Shader;

function preload() {
  // choose shape and preload shader

  circleShader = loadShader('shader_files/starter.vert', 'shader_files/circles.frag');
  flowerShader = loadShader('shader_files/starter.vert', 'shader_files/flowers.frag');
}


function setup() {
  pixelDensity(1);
  // shaders require WEBGL mode to work
  createCanvas(400, 400, WEBGL);
  noStroke();

  sel = createSelect();
  sel.option('circle');
  sel.option('flowers');
  sel.selected('circle');
  sel.changed(chooseTile);

  rSlider = createSlider(0, 255, 0);
  gSlider = createSlider(0, 255, 0);
  bSlider = createSlider(0, 255, 0);
  let colors = getItem("colors");
  if (colors !== null) {
    rSlider.value(colors.r);
    rSlider.value(colors.g);
    rSlider.value(colors.b);
  }
  rSlider.changed(storeData);
  gSlider.changed(storeData);
  bSlider.changed(storeData);
}


function draw() {
  background(0);

  let name = getItem('fname');
  if (name !== null) {
    console.log(name);
    let choice = name;

    if (choice === "flower") {
      flowerShader.setUniform('u_resolution', [width, height]);
      // flowerShader.setUniform('rValue', r);
      // flowerShader.setUniform('gValue', g);
      // flowerShader.setUniform('bValue', b);
      shader(flowerShader);
    } else {
      circleShader.setUniform('u_resolution', [width, height]);
      shader(circleShader);
    }
  }


  // rect gives us some geometry on the screen
  rect(0, 0, width, height);

}

function chooseTile() {
  console.log("fname: " + sel.value());
  storeItem('fname', sel.value());
}

function storeData() {
  let colors = {
    r: rSlider.value(),
    g: gSlider.value(),
    b: bSlider.value(),
  }
  storeItem('colors', colors);
}
// function fileName(fname) {

//   let str0 = 'Shader';

//   let nameStr;
//   if (fname === 'circle') {
//     nameStr = 'circle';
//   } else {
//     nameStr = 'flower';
//   }
//   return `${nameStr}${str0}`;
// }

// function passUniform(fname) {
//   let str0 = 'Shader';
//   let str1 = '.uniform';
//   let str2 = "('u_resolution', [width, height])";

//   let nameStr;
//   if (fname === 'circle') {
//     nameStr = 'circle';
//   } else {
//     nameStr = 'flower';
//   }
//   return `${nameStr}${str0}${str1}${str2}`;
// }

// function mousePressed() {
// saveFrames('uv', 'png', 1, 1);

// }