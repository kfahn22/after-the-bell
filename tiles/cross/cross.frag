// Frag shader creates swirl tiles for wave function collapse

#ifdef GL_ES
precision mediump float;
#endif

// Pass in uniforms from the sketch.js file
uniform vec2 u_resolution; 
uniform float iTime;
uniform vec2 iMouse;
uniform float iFrame;
//uniform sampler2D tex0;

#define S smoothstep
#define CG colorGradient
#define PI 3.14159

#define RED vec3(255,0,0)/255.
#define YELLOW vec3(255,255,0)/255.

#define GREEN vec3(83,255,69)/255.
#define GREY vec3(89,89,89)/255.
#define BLUE vec3(30,46,222)/255.
#define PURPLE vec3(63,46,86)/255.
#define MAUVE vec3(187,182,223)/255.
#define LTPURPLE vec3(198,200,238)/255.
#define RASPBERRY vec3(222,13,146)/255.

vec3 colorGradient(vec2 uv, vec3 col1, vec3 col2, float m) {
  float k = uv.y*m + m;
  vec3 col = mix(col1, col2, k);
  return col;
}  

// Rotation matrix
mat2 Rot(float a) {
    float s=sin(a), c=cos(a);
    return mat2(c, -s, s, c);
}

// Copied from Inigo Quilez
float sdSegment( vec2 uv, vec2 a, vec2 b) {
  vec2 pa = uv-a, ba = b-a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa-ba*h );
}

float sdCircle( vec2 uv, float r) {
  return length(uv) - r;
} 

//From Inigo Quilez
float sdBox( vec2 uv, vec2 b )
{
    vec2 d = abs(uv)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

// From Inigo Quilez
float sdRoundedBox( vec2 uv, vec2 b, vec4 r) {
  r.xy = (uv.x>0.0) ? r.xy : r.zw;
  r.x = (uv.y>0.0) ? r.x : r.y;
  vec2 q = abs(uv) - b + r.x;
  return min( max(q.x, q.y), 0.0) + length(max(q, 0.0) ) - r.x;
}

// Function to check for symmetry of design
vec3 checkSymmetry( vec2 uv ) {
    float d1 = sdSegment(uv, vec2(-.5, .0), vec2(0.5, .0));
    float l1 = S(.008, .0, d1); // horizontal center line
    float d2 = sdSegment(uv, vec2(-.5, -.25), vec2(0.5, -.25));
    float l2 = S(.008, .0, d2); // horizontal line
    float d3 = sdSegment(uv, vec2(-.5, .25), vec2(0.5, .25));
    float l3 = S(.008, .0, d3); // horizontal line
    float d4 = sdSegment(uv, vec2(-.5, -.125), vec2(0.5, -.125));
    float l4 = S(.008, .0, d4); // horizontal line
    float d5 = sdSegment(uv, vec2(-.5, .125), vec2(0.5, .125));
    float l5 = S(.008, .0, d5); // horizontal line
    float d6 = sdSegment(uv, vec2(-.5, -.0625), vec2(0.5, -.0625));
    float l6 = S(.008, .0, d6); // horizontal line
    float d7 = sdSegment(uv, vec2(-.5, .0625), vec2(0.5, .0625));
    float l7 = S(.008, .0, d7); // horizontal line  
    float d8 = sdSegment(uv, vec2(-.5, -.1875), vec2(0.5, -.1875));
    float l8 = S(.008, .0, d8); // horizontal line
    float d9 = sdSegment(uv, vec2(-.5, .1875), vec2(0.5, .1875));
    float l9 = S(.008, .0, d9); // horizontal line  
    float d10 = sdSegment(uv, vec2(-.5, -.3125), vec2(0.5, -.3125));
    float l10 = S(.008, .0, d10); // horizontal line
    float d11 = sdSegment(uv, vec2(-.5, .3125), vec2(0.5, .3125));
    float l11 = S(.008, .0, d11); // horizontal line  
    float d12 = sdSegment(uv, vec2(-.5, -.375), vec2(0.5, -.375));
    float l12 = S(.008, .0, d12); // horizontal line
    float d13 = sdSegment(uv, vec2(-.5, .375), vec2(0.5, .375));
    float l13 = S(.008, .0, d13); // horizontal line  
    float d14 = sdSegment(uv, vec2(-.5, -.4375), vec2(0.5, -.4375));
    float l14 = S(.008, .0, d14); // horizontal line
    float d15 = sdSegment(uv, vec2(-.5, .4375), vec2(0.5, .4375));
    float l15 = S(.008, .0, d15); // horizontal line  
    vec3 l = (l1 + l2 + l3) * RED  + ( l4 + l5 + l6 + l7 + l8 + l9 
          + l10 + l11 + l12 + l13 + l14 + l15) * YELLOW;
    // vertical lines
    float d16 = sdSegment(uv, vec2(0.0, -0.5), vec2(0.0, 0.5));
    float v16 = S(.008, .0, d16); // vertical center line
    float d17 = sdSegment(uv, vec2(0.25, 0.5), vec2(.25, -0.5));
    float v17 = S(.008, .0, d17); // vertical  line
    float d18 = sdSegment(uv, vec2(-0.25, 0.5), vec2(-0.25, -0.5));
    float v18 = S(.008, .0, d18); // vertical  line
    float d20 = sdSegment(uv, vec2(0.125, -.5), vec2(0.125, .5));
    float v20 = S(.008, .0, d20); // vertical line
    float d21 = sdSegment(uv, vec2(-0.125, .5), vec2(-0.125, -.5));
    float v21 = S(.008, .0, d21); // vertical  line
    float d22 = sdSegment(uv, vec2(0.0625, -.5), vec2(0.0625, .5));
    float v22 = S(.008, .0, d22); // vertical line
    float d23 = sdSegment(uv, vec2(-0.0625, .5), vec2(-0.0625, -.5));
    float v23 = S(.008, .0, d23); // vertical  line
    float d24 = sdSegment(uv, vec2(.1875, .5), vec2(.1875, -.5));
    float v24 = S(.008, .0, d24); // vertical  line
    float d25 = sdSegment(uv, vec2(-0.1875, -.5), vec2(-0.1875, .5));
    float v25 = S(.008, .0, d25); // vertical line
    float d26 = sdSegment(uv, vec2(.3125, .5), vec2(.3125, -.5));
    float v26 = S(.008, .0, d26); // vertical  line
    float d27 = sdSegment(uv, vec2(.375, .5), vec2(.375, -.5));
    float v27 = S(.008, .0, d27); // vertical  line
    float d28 = sdSegment(uv, vec2(-0.375, -.5), vec2(-0.375, .5));
    float v28 = S(.008, .0, d28); // vertical line
    float d29 = sdSegment(uv, vec2(-.3125, .5), vec2(-.3125, -.5));
    float v29 = S(.008, .0, d29); // vertical  line
    float d30 = sdSegment(uv, vec2(.4375, .5), vec2(.4375, -.5));
    float v30 = S(.008, .0, d30); // vertical  line
    float d31 = sdSegment(uv, vec2(-.4375, .5), vec2(-.4375, -.5));
    float v31 = S(.008, .0, d31); // vertical  line
    vec3 v = (v16 + v17 + v18) * RED + ( v20 + v21 + v22
     + v23 + v24 + v25 + v26 + v27 + v28 + v29 + v30 + v31) * YELLOW;
    return l + v;
}

// Middle column
float column( vec2 uv) {
    float s1 = sdCircle(uv - vec2(.80, .0), .75);
    float m1 = S(.008, 0., s1);
    float s2 = sdCircle(uv - vec2(-.80, .0), .75);
    float m2 = S(.008, 0., s2);
    float s3 = sdCircle(uv - vec2(.0, .80), .75);
    float m3 = S(.008, 0., s3);
    float s4 = sdCircle(uv - vec2(.0, -.80), .75);
    float m4 = S(.008, 0., s4);
    float m = m1 + m2;
    return 1. - m;
}

// cross
float cross( vec2 uv) {
    float s1 = sdCircle(uv - vec2(.80, .0), .75);
    float m1 = S(.008, 0., s1);
    float s2 = sdCircle(uv - vec2(-.80, .0), .75);
    float m2 = S(.008, 0., s2);
    float s3 = sdCircle(uv - vec2(.0, .80), .75);
    float m3 = S(.008, 0., s3);
    float s4 = sdCircle(uv - vec2(.0, -.80), .75);
    float m4 = S(.008, 0., s4);
    float m11 = m1 + m2;
    float m12 = m3 + m4;
    return min(m11, m12);
}

float junction( vec2 uv) {
    float s1 = cross(uv);
    float m1 = S(.008, 0., s1);
    // this line adds a constrained cross
    //float s5 = sdBox(uv - vec2(0.0, 0.0), vec2(0.5, 0.25) );
    float s2 = sdCircle(uv - vec2(0.8, 0.0), .75);
    float m2 = S(.008, 0., s2);
    return min(m1, 1. - m2);
}

 // rainbow on edge
 float rainbow( vec2 uv) {
   float s1 = sdCircle(uv - vec2(0.0, -0.5), 0.5);
   float m1 = S(.008, 0., s1);
   float s2 = sdCircle(uv - vec2(0.0, -0.5), 0.25);
   float m2 = S(.008, 0., s2);
   return m1 - m2;
   }
   
   // half circle on edge
 float btHalfCircle( vec2 uv) {
    float s = sdCircle(uv - vec2(0.0, -0.5), 0.25);
    float m = S(.008, 0., s);
    return m;
   }

// two half circle on outer edge
 float twoHalfCircles( vec2 uv) {
    float s1 = sdCircle(uv - vec2(-0.375, -0.5), 0.125);
    float m1 = S(.008, 0., s1);
    float s2 = sdCircle(uv - vec2(0.375, -.5), .125);
    float m2 = S(.008, 0., s2);
    return m1 + m2;
   }

// Choose shape
vec3 chooseShape( float shapechoice, vec2 uv, vec3 col1, vec3 col2 ) {
  vec3 col = vec3(0.0);
//   // vec3 bkcol = chooseColor( col1 ); 
//   // vec3 shapecol = chooseColor( col2 );
       
   if (shapechoice == 0.0) {
     col = col1;
   }
 else if (shapechoice == 1.0) {
    float cm = column( uv );
    col += (1. - cm) * col1 + cm * col2;
  }
  else if (shapechoice == 2.0) {
    float j = junction( uv );
    col += (1. - j) * col1 + j * col2;
  }
  else if (shapechoice == 3.0) {
    float cr = cross( uv );
    col += (1. - cr) * col1 + cr * col2;
  }
  else if (shapechoice == 4.0) {
    float bhc = btHalfCircle( uv );
    col += (1. - bhc) * col1 + bhc * col2;
  }
  else if (shapechoice == 5.0) {
    float thc = twoHalfCircles( uv );
    col += (1. - thc) * col1 + thc * col2;
  }
   else if (shapechoice == 6.0) {
    float rb = rainbow( uv );
    col += (1. - rb) * col1 + rb * col2;
  }
 return col;
}

void main()
{
    vec2 uv = (gl_FragCoord.xy -.5*u_resolution.xy)/u_resolution.y;
	
    vec3 col = vec3(0);
  
   vec3 cs = checkSymmetry( uv);
   //col += cs;
 
  col += chooseShape( 36.0, uv, GREY, GREEN);
  // col += chooseShape( 0.0, uv, GREEN, GREY);
 
    gl_FragColor = vec4(col,1.0);
}
