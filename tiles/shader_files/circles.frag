// Frag shader creates tiles for wave function collapse

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

float Arc( vec2 uv, float r1, float r2) {
  return abs(sdCircle(uv, r1)) - r2;
}

float sdPie( in vec2 p, in vec2 c, in float r )
{
    p.x = abs(p.x);
    float l = length(p) - r;
    float m = length(p-c*clamp(dot(p,c),0.0,r)); // c=sin/cos of aperture
    return max(l,m*sign(c.y*p.x-c.x*p.y));
}


vec3 circleTile( vec2 uv, vec3 col1, vec3 col2, vec3 col3, float angle ) {
  vec2 gv = Rot(angle) * uv;
  float s1 = Arc(gv - vec2(.5, 0.), .2, .025);
  float m1 = S(.008, .0, s1);
  float s2 = Arc(gv - vec2(.5, 0.), .1, .025);
  float m2 = S(.008, .0, s2);
  float s3= sdCircle(gv - vec2(.5, 0.), .025);
  float m3 = S(.008, .0, s3);
  return m1* col1 + m2 * col2 + m3 * col3;
}


float opCircle( vec2 uv, float r1, float r2) {
  return abs( sdCircle(uv, r1) )- r2;
}

// vec3 sdMiddleCircles( vec2 uv, vec3 col1, vec3 col2, vec3 col3, float width) {
//    vec3 col = vec3(0);
//    //float s1= opCircle(uv - vec2(0., .5), .25, .025);
//   // float m1 = S(.008, .0, s1);
//   /// float s2= opCircle(uv - vec2(0., .5), .35, .025);
//    //float m2 = S(.008, .0, s2);
//    float s3 = sdCircle(uv - vec2(0., .5), .45, .02);
//    float s3= opCircle(uv - vec2(0., .5), .45, .025);
//    float m3 = S(.008, .0, s3);
//     return col +=  m3*col3 ;
// }

void main()
{
    vec2 uv = (gl_FragCoord.xy -.5*u_resolution.xy)/u_resolution.y;
	
    vec3 col = vec3(0);
  
    // Uncomment to check for symmetry
    float d1 = sdSegment(uv, vec2(-.5, .0), vec2(0.5, .0));
    float l1 = S(.008, .0, d1); // horizontal center line
    float d2 = sdSegment(uv, vec2(0., -.5), vec2(0., .5));
    float l2 = S(.008, .0, d2); // vertical center line
    float d3 = sdSegment(uv, vec2(.25, .5), vec2(.25, -.5));
    float l3 = S(.008, .0, d3); // vertical center line
    //col += l1 + l2  + l3;
  
   // Change a (angle) to get Up, Down, Right, Left
   // a = 0. vertical, a = 1. horizontal
   float a = 3.; //  Right 0., Up  1., Left 2., Down 3. 
  
 
  
//   vec3 middle_circles = sdMiddleCircles(uv, RASPBERRY, GREEN, BLUE, .25);
//   col = max(col, middle_circles);
//   // Half circles 
  
 
  // // Circles in corners
  // vec2 st = abs(uv);
  // vec3 c4 = sdCircleCorner(uv, .025, BLUE, GREEN, RASPBERRY);
  // //col += c4;
   
  float angle = 0.;
   vec2 gv = Rot(angle) * uv;
 
   //Half circle
   // float s = sdCircle(gv - vec2(.50, .0), .49) ;
   // diamond - like shape
   float s4 = sdCircle(uv - vec2(.50, .50), .495) ;
   float m4 = S(.008, 0., s4);
   float s5 = sdCircle(uv - vec2(.5, -.5), .495) ;
   float m5 = S(.008, 0., s5);
   float s6 = sdCircle(uv - vec2(-.50, .50), .495) ;
   float m6 = S(.008, 0., s6);
   float s7 = sdCircle(uv - vec2(-.50, -.50), .495);
   float m7 = S(.008, 0., s7);
   //float m = (m4 + m5 + m6 + m7) ;
  
  // Arc
   float s8 = sdCircle(uv - vec2(.5, -.5), .995);
   //float m = S(.008, 0., s8);
  
  
  // Half Circle
  float s9 = sdCircle(uv - vec2(.0, .50), .495);
  //float m = S(.008, 0., s9);
  
  // curved up and down
  float s10 = sdCircle(uv - vec2(.80, .0), .75);
  float m11 = S(.008, 0., s10);
  // float s11 = sdCircle(uv - vec2(-.80, .0), .75);
  // float m12 = S(.008, 0., s11);
//   float s13 = sdCircle(uv - vec2(.0, .80), .75);
//   float m13 = S(.008, 0., s13);
//   float s14 = sdCircle(uv - vec2(.0, -.80), .75);
//   float m14 = S(.008, 0., s14);
  
 // float m = m11;
 //float m = m11 + m12;
//  float mm1 = m11 + m12;
  
// float mm2 = m13 + m14;

//float m =  min(mm1, mm2);
  
  
   // curved tilted 
  float s50 = sdCircle(uv - vec2(.33, .0), .75);
  float m51 = S(.008, 0., s50);
  
  float m = m51;
  
   //Circles in corners
   float s24 = sdCircle(uv - vec2(.25, .25), .495) ;
   float m24 = S(.008, 0., s24);
   float s25 = sdCircle(uv - vec2(.25, -.25), .495) ;
   float m25 = S(.008, 0., s25);
   float s26 = sdCircle(uv - vec2(-.25, .25), .495) ;
   float m26 = S(.008, 0., s26);
   float s27 = sdCircle(uv - vec2(-.25, -.25), .495);
   float m27 = S(.008, 0., s27);
  
   // float mm1 = max(m24, m25);
   // float mm2 = max(m26, m27);
  
//    float mm1 = m24 - m25;
//    float mm2 = m26 - m27;
//    float m =1. - (mm1,  mm2); 
  
  
   //Circles in corners
   float s34 = sdCircle(uv - vec2(.7, .7), .495) ;
   float m34 = S(.008, 0., s34);
   float s35 = sdCircle(uv - vec2(.7, -.7), .495) ;
   float m35 = S(.008, 0., s35);
   float s36 = sdCircle(uv - vec2(-.7, .7), .495) ;
   float m36 = S(.008, 0., s36);
   float s37 = sdCircle(uv - vec2(-.7, -.7), .495);
   float m37 = S(.008, 0., s37);
  
   // float mm1 = max(m24, m25);
   // float mm2 = max(m26, m27);
  
    float mm1 = m34 + m35;
    float mm2 = m36 + m37;
    //float m = m34 + m37;
   // float m = mm1 + mm2;
   //col = m * MAUVE +  PURPLE;
  col = (1. - m) * MAUVE + m * PURPLE;
  //col += (1. - m) * PURPLE + m * MAUVE;
 
 
    gl_FragColor = vec4(col,1.0);
}
