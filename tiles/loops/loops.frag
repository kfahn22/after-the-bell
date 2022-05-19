// Frag shader creates train tiles for wave function collapse

#ifdef GL_ES
precision mediump float;
#endif

// Pass in resolution from the sketch.js file
uniform vec2 u_resolution; 
uniform float bkcolor;
uniform float shapecolor;
uniform float shapechoice;

#define S smoothstep
#define CG colorGradient
#define PI 3.14159

#define RED vec3(255,0,0)/255.
#define YELLOW vec3(255,255,0)/255.

#define GREY vec3(201,206,204)/255.
#define TEAL1 vec3(18,88,98)/255.
#define TEAL vec3(54,88,101)/255.
#define LTGREY vec3(251,249,248)/255.


#define WHITE vec3(1.)/255.

#define PURPLE vec3(63,46,86)/255.
#define MAUVE vec3(187,182,223)/255.

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

//From Inigo Quilez
float sdBox( vec2 uv, vec2 b )
{
    vec2 d = abs(uv)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float sdCircle( vec2 uv, float r) {
  return length(uv) - r;
} 

float Arc( vec2 uv, float r1, float r2) {
  return abs(sdCircle(uv, r1)) - r2;
}

// From Inigo Quilez
float sdArc( in vec2 p, in vec2 sc, in float ra, float rb )
{
    // sc is the sin/cos of the arc's aperture
    p.x = abs(p.x);
    return ((sc.y*p.x>sc.x*p.y) ? length(p-sc*ra) : 
                                  abs(length(p)-ra)) - rb;
}

// From Inigo Quilez
float sdVesica(vec2 uv, float r, float d)
{
    uv = abs(uv);
    float b = sqrt(r*r-d*d);
    return ((uv.y-b)*d>uv.x*b) ? length(uv-vec2(0.0,b))
                             : length(uv-vec2(-d,0.0))-r;
}

// From Inigo Quilez
float sdEgg( vec2 p, float ra, float rb )
{
    const float k = sqrt(3.0);
    p.x = abs(p.x);
    float r = ra - rb;
    return ((p.y<0.0)       ? length(vec2(p.x,  p.y    )) - r :
            (k*(p.x+r)<p.y) ? length(vec2(p.x,  p.y-k*r)) :
                              length(vec2(p.x+r,p.y    )) - 2.0*r) - rb;
}

float dot2(in vec2 v ) { return dot(v,v); }
// From Inigo Quilez
float sdTrapezoid(  vec2 p, float r1, float r2, float he )
{
    vec2 k1 = vec2(r2,he);
    vec2 k2 = vec2(r2-r1,2.0*he);
    p.x = abs(p.x);
    vec2 ca = vec2(p.x-min(p.x,(p.y<0.0)?r1:r2), abs(p.y)-he);
    vec2 cb = p - k1 + k2*clamp( dot(k1-p,k2)/dot2(k2), 0.0, 1.0 );
    float s = (cb.x<0.0 && ca.y<0.0) ? -1.0 : 1.0;
    return s*sqrt( min(dot2(ca),dot2(cb)) );
}

// From Inigo Quilez
float sdMoon(vec2 p, float d, float ra, float rb )
{
    p.y = abs(p.y);
    float a = (ra*ra - rb*rb + d*d)/(2.0*d);
    float b = sqrt(max(ra*ra-a*a,0.0));
    if( d*(p.x*b-p.y*a) > d*d*max(b-p.y,0.0) )
          return length(p-vec2(a,b));
    return max( (length(p          )-ra),
               -(length(p-vec2(d,0))-rb));
}
// From Inigo Quilez
float sdEquilateralTriangle( vec2 p )
{
    const float k = sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return -length(p)*sign(p.y);
}
// From Inigo Quilez
float sdTriangleIsosceles( vec2 p, vec2 q )
{
    p.x = abs(p.x);
    vec2 a = p - q*clamp( dot(p,q)/dot(q,q), 0.0, 1.0 );
    vec2 b = p - q*vec2( clamp( p.x/q.x, 0.0, 1.0 ), 1.0 );
    float s = -sign( q.y );
    vec2 d = min( vec2( dot(a,a), s*(p.x*q.y-p.y*q.x) ),
                  vec2( dot(b,b), s*(p.y-q.y)  ));
    return -sqrt(d.x)*sign(d.y);
}

// From Inigo Quilez
// For vec4 r corners are NE, SE, NW, SW
float sdRoundedBox( vec2 uv, vec2 b, vec4 r) {
  r.xy = (uv.x>0.0) ? r.xy : r.zw;
  r.x = (uv.y>0.0) ? r.x : r.y;
  vec2 q = abs(uv) - b + r.x;
  return min( max(q.x, q.y), 0.0) + length(max(q, 0.0) ) - r.x;
}

// From Inigo Quilez
//combine so that they smoothly blend
float smin( in float a, in float b, float k)
{
 float h = max( k - abs(a-b), 0.0); // "spike" function look at grpahtoy
 return min(a,b) - h*h/(k*4.0);
}
// Function to choose colors 
vec3 chooseColor( float choice ) {
    vec3 colchoice;
    
    if ( choice == 0.0 )  { //white
      colchoice = vec3( 1.0 ); 
    } // blank tile
    else if ( choice  == 1.0 ) { //black
      colchoice = vec3(0.0);
          }
    else if ( choice  == 2.0 ) { //grey
      colchoice = vec3(125,125,125)/255.0;
    }
    else if ( choice  == 3.0 ) { //red
      colchoice = vec3(255, 0, 0)/255.0;
    }
    else if ( choice  == 4.0 ) { //orange
      colchoice = vec3(255,127,0)/255.0;
    }
    else if ( choice  == 5.0 ) { //yellow
      colchoice = vec3(255,255,0)/255.0;
    }
    else if ( choice  == 6.0 ) { //green
      colchoice = vec3(0,255,0)/255.0;
    }
    else if ( choice  == 7.0 ) { // blue
      colchoice = vec3(0,0,255)/255.0;
    }
    else if ( choice == 8.0 ) { // violet
      colchoice = vec3(255,0,255)/255.0;
    }
  return colchoice;
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

// Small square corner
float sdSmallCorner( vec2 uv ) {
  float s1 = sdBox( uv - vec2(-0.5, 0.25), vec2(0.25, 0.05) );
  float m1 = S(.008, .0, s1);
  float s2 = sdBox( uv - vec2(-0.25,0.35), vec2(0.05, 0.15) );
  float m2 = S(.008, .0, s2);
  return m1 + m2 - min(m1, m2);
}

// Two small square corners
float sdSmallCorners( vec2 uv ) {
  float s1 = sdBox( uv - vec2(-0.5, 0.25), vec2(0.25, 0.05) );
  float m1 = S(.008, .0, s1);
  float s2 = sdBox( uv - vec2(-0.25,0.35), vec2(0.05, 0.15) );
  float m2 = S(.008, .0, s2);
  float mm1 = m1 + m2 - min(m1, m2);
  float s3 = sdBox( uv - vec2(0.35, -0.25), vec2(0.15, 0.05) );
  float m3 = S(.008, .0, s3);
  float s4 = sdBox( uv - vec2(0.25,-0.35), vec2(0.05, 0.15) );
  float m4 = S(.008, .0, s4);
  float mm2 = m3 + m4 - min(m3, m4);
  return mm1 + mm2 - min(mm1,mm2);
}

// Large square corner
float sdLargeCorner( vec2 uv ) {
  float s1 = sdBox( uv - vec2(-0.25, 0.25), vec2(0.55, 0.05) );
  float m1 = S(.008, .0, s1);
  float s2 = sdBox( uv - vec2(0.25, -0.25), vec2(0.05, 0.45) );
  float m2 = S(.008, .0, s2);
  return m1 + m2 - min(m1, m2);
}

float sdKink1( vec2 uv) {
  float s1 = sdBox( uv - vec2(-0.25, 0.25), vec2(0.25, 0.05) );
  float m1 = S(.008, .0, s1);
  float s2 = sdBox( uv - vec2(0.0, 0.0), vec2(0.05, 0.3) );
  float m2 = S(.008, .0, s2);
  float s3 = sdBox( uv - vec2(0.25, -0.25), vec2(0.25, 0.05) );
  float m3 = S(.008, .0, s3);
  return m1 + m2 + m3 - min(m1, m2) - min(m3, m2);
}

float sdSmallCircle( vec2 uv) {
  float s1 = abs(sdCircle( uv - vec2(-0.5, -0.5), 0.25)) - 0.05;
  float m1 = S(.008, .0, s1);
  return m1;
}

float sdBigCircle( vec2 uv) {
  float s1 = abs(sdCircle( uv - vec2(-0.5, -0.5), 0.75)) - 0.05;
  float m1 = S(.008, .0, s1);
  return m1;
}

float sdBigCircles( vec2 uv) {
  float s1 = abs(sdCircle( uv - vec2(-0.5, -0.5), 0.75)) - 0.05;
  float m1 = S(.008, .0, s1);
  float s2 = abs(sdCircle( uv - vec2(0.5, 0.5), 0.75)) - 0.05;
  float m2 = S(.008, .0, s2);
  return m1 + m2 - min(m1,m2);
}

// Two interlocking squares
float sdLockingSq( vec2 uv) {
  float s1 = sdBox( uv - vec2(-0.25, 0.25), vec2(0.55, 0.05) );
  float m1 = S(.008, .0, s1);
  float s2 = sdBox( uv - vec2(0.25, -0.25), vec2(0.05, 0.45) );
  float m2 = S(.008, .0, s2);
  float s3 = sdBox( uv - vec2(0.25, -0.25), vec2(0.55, 0.05) );
  float m3 = S(.008, .0, s3);
  float s4 = sdBox( uv - vec2(-0.25, 0.25), vec2(0.05, 0.45) );
  float m4 = S(.008, .0, s4);
  return m1 + m2 + m3 + m4 - min(m1, m2) - min(m3, m2) - min(m1, m4) - min(m3, m4);
}

float sdLrgSqLoop( vec2 uv, float a, float b, float c, float d ) {
  // left vertical
   float s1 = sdBox( uv - vec2(a-.25, b+.0), vec2(c, d*2.75) );
   float m1 = S(0.008, 0.0, s1);
   // right vertical
   float s2= sdBox( uv - vec2(a + .25, b - .2), vec2(c, d*4.75) );
   float m2 = S(0.008, 0.0, s2);
   // top horizontal
   float s3= sdBox( uv - vec2(a - .025, b + .25), vec2(2.5*d, c) );
   float m3 = S(0.008, 0.0, s3);
   //bottom horizontal
   float s4= sdBox( uv - vec2(a + .375, b - .25), vec2(6.0*d, c) );
   float m4 = S(0.008, 0.0, s4);
   float mm1 = m1 + m2;
   float mm2 = m3 + m4;
   return  mm1 + mm2 - min(mm1, mm2);
}

float sdSmSqLoop( vec2 uv, float a, float b, float c, float d ) {
  // left vertical
   float s1 = sdBox( uv - vec2(a, b-.125), vec2(c, d*1.5) );
   float m1 = S(0.008, 0.0, s1);
   // right vertical
   float s2= sdBox( uv - vec2(a + .25 , b - .25), vec2(c, d*2.75) );
   float m2 = S(0.008, 0.0, s2);
   // top horizontal
   float s3= sdBox( uv - vec2(a+.1, b), vec2(1.2*d, c) );
   float m3 = S(0.008, 0.0, s3);
   //bottom horizontal
   float s4= sdBox( uv - vec2(a + .375, b - .25), vec2(4.0*d, c) );
   float m4 = S(0.008, 0.0, s4);
   float mm1 = m1 + m2;
   float mm2 = m3 + m4;
   return  mm1 + mm2 - min(mm1, mm2);
}

float sdSquareLoop( vec2 uv, float a, float b, float c1, float d1, float c2, float d2, float c3, float d3,  float c4, float d4) {
    float s1 = sdBox( uv - vec2(a-.15, b+.075), vec2(c1*.025, d1*0.1) );
   float m1 = S(0.008, 0.0, s1);
   // right vertical
   float s2= sdBox( uv - vec2(a , b - .101), vec2(c2*0.025, d2*0.1) );
   float m2 = S(0.008, 0.0, s2);
   // top horizontal
   float s3= sdBox( uv - vec2(a - .075, b + .175), vec2(d3*0.1, c3*.025) );
   float m3 = S(0.008, 0.0, s3);
   //bottom horizontal
   float s4= sdBox( uv - vec2(a + .05, b - .025), vec2(d4*0.1, c4*.025) );
   float m4 = S(0.008, 0.0, s4);
   float mm1 = m1 + m2;
   float mm2 = m3 + m4;
   return  mm1 + mm2 - min(mm1, mm2);
}

float doubleSquareLoops( vec2 uv, float x, float y) {
    float m1 = sdSquareLoop(uv, -0.1, 0.1, 1., 1., 1., 2.75, 0.25, 1., 0.25, 2.25);
    float m2 = sdSquareLoop(vec2(-uv.x, uv.y), -0.1, 0.1, 1., 1., 1., 2.75, 0.25, 1., 0.25, 2.25);
    float s3 = sdBox( vec2(uv.x, uv.y) - vec2(-0.3, -0.25), vec2(.2, .025));
    float m3 = S(0.008, 0.0, s3);
    float s4 = sdBox( vec2(uv.x, uv.y) - vec2(0.3, -0.25), vec2(.2, .025));
    float m4 = S(0.008, 0.0, s4);
    float mm1 = m1 + m2 - min(m1, m2);
    float mm2 = m3 + m4;
    return mm1 + mm2 - min(mm1, mm2);
    //return m1 + m2 ;
}
 
 float doubleSquareLoops2( vec2 uv, float x, float y) {
    float m1 = sdSquareLoop(uv, -0.10, 0.1, 0.25, 1., 0.25, 2.75, 1.0, 0.8, 1.0, 2.05);
    float m2 = sdSquareLoop(vec2(-uv.x, uv.y), -0.1, 0.1, 0.25, 1.0, 0.25, 2.75, 1.0, 0.8, 1.0, 2.05);
    float s3 = sdBox( vec2(uv.x, uv.y) - vec2(-0.3, -0.25), vec2(.2, .025));
    float m3 = S(0.008, 0.0, s3);
    float s4 = sdBox( vec2(uv.x, uv.y) - vec2(0.3, -0.25), vec2(.2, .025));
    float m4 = S(0.008, 0.0, s4);
    float mm1 = m1 + m2 - min(m1, m2);
    float mm2 = m3 + m4;
    return mm1 + mm2 - min(mm1, mm2);
    //return m1 + m2 ;
}
 
// float roundLoop1( vec2 uv) {
//   // float s1 = sdEllipse( uv, vec2(.05, .05));
//   // float m1 = S(0.008, 0.0, s1);
//   float s2 = sdVesica( uv, .22, .15);
//   float m2 = S(0.008, 0.0, s2);
//   float s3 = sdCircle( uv,  .175);
//   float m3 = S(0.008, 0.0, s3);
//   //return m1;// + m2;
//   return m3 - m2;
// }

// w1 = .175
float sdOval( vec2 uv, float w1, float w2 ) {
  // float s2 = sdVesica( uv, .22, .15);
  // float m2 = S(0.008, 0.0, s2);
  float s1 = sdCircle( uv,  w1);
  float m1 = S(0.008, 0.0, s1);
  float s2 = sdCircle( uv - vec2(.05, 0.0), w2);
  float m2 = S(0.008, 0.0, s2);
  float mm1 = m1 - m2;
  float s3 = sdCircle( uv,  w1);
  float m3 = S(0.008, 0.0, s1);
  float s4 = sdCircle( uv + vec2(.05, 0.0), w2);
  float m4 = S(0.008, 0.0, s4);
  float mm2 = m3 - m4;
  return 1. - (mm1 + mm2 - min(mm1, mm2));
}

float sdOval2( vec2 uv) {
  float s1 = sdEgg( (Rot(PI * 4./4.) * uv) - vec2(0.0, -0.125), .275, .075);
  float m1 = S(0.008, 0.0, s1);
  float s2 = sdEgg( (Rot(PI * 4./4.) * uv) - vec2(0.0, -0.1), .20, .05);
  float m2 = S(0.008, 0.0, s2);
  return m1 - m2;
}

// Curved tails
float roundLoop1( vec2 uv, float w) {
  float s1 = sdOval( uv - vec2(0.0, 0.13), .175, w);
  float m1 = S(0.008, 0.0, s1);
  float s2 = abs(sdArc(  uv, vec2( (.35), cos(.35) ), .7, .75)) - .015;
  float m2 = S(0.008, 0.0, s2);
  return m1 + m2 - min(m1, m2);
 
}

// Straight tails
float roundLoop2( vec2 uv, float w) {
  float s1 = sdOval( uv - vec2(0.0, 0.09), .175, w);
  float m1 = S(0.008, 0.0, s1);
  float s2 = abs(sdRoundedBox( uv - vec2(-.475, .525), vec2(.65, .65), vec4(0.0, 0.3, 0.0, 0.0))) - .0125;
  float m2 =  S(0.008, 0.0, s2);
  float s3 = sdBox(uv - vec2(0.2, 0.0), vec2(.1, .5));
  float m3 =  S(0.008, 0.0, s3);
  float s4 = abs(sdRoundedBox( uv - vec2(.475, .525), vec2(.65, .65), vec4(0.0, 0.0, 0.0, 0.3))) - .0125;
  float m4 =  S(0.008, 0.0, s4);
  float s5 = sdBox( uv - vec2(-0.2, 0.0), vec2(.1, .5));
  float m5=  S(0.008, 0.0, s5);
  float mm1 = min(m2, 1. - m3);
  float mm2 = min(m4, 1. - m5);
  float mm = max(mm1, mm2);
  float mm3 = min(m2, m4);
  float mm4 = min(m1, mm3);
  return m1 + mm1 + mm2  - mm3 - smin(m1, mm, 0.2);
}

// Fatter tails
float roundLoop3( vec2 uv, float w) {
  float s1 = sdOval( uv - vec2(0.0, 0.125), .175, w);
  float m1 = S(0.008, 0.0, s1);
   // Change angle to change arc sin(.45), cos(.90)
   // Second parameters determines placement 
  float s2 = abs(sdArc(  uv - vec2(0.0, 0.20), vec2( sin(.45), cos(.90) ), .5, .6)) - .01;
  float m2 = S(0.008, 0.0, s2);
  // Add a box to eliminate curved part of arc at edges
  float s3 = sdBox ( vec2((uv.x), uv.y) - vec2( -0.35, -0.09), vec2(0.15, 0.1));
  float m3 = S(0.008, 0.0, s3);
  float s4 = sdBox ( vec2((uv.x), uv.y) - vec2( 0.35, -0.09), vec2(0.15, 0.1));
  float m4 = S(0.008, 0.0, s4);
  float mm1 = m2 - min(m2, m3) - min(m2, m4);
  // Note:  altering (x,y) position is counter-intuitive
  // b/c there is a rotation, change uv.x to alter vertical pos, uv.y to alter horizontal pos
  float s5 = sdTrapezoid( (Rot(PI*2./4.) * uv) - vec2(-0.09, 0.345), .01, .025, .15);
  float m5 = S(0.008, 0.0, s5);
  float s6 = sdTrapezoid( (Rot(PI*2./4.) * uv) - vec2(-0.09, -0.345), .025, .01, .15);
  float m6 = S(0.008, 0.0, s6);
  float mm2 =  m1 + mm1 - min(m1, mm1);
  float mm3 = m5 + m6;
  return  mm2 + mm3 - min(mm2, mm3);
}

// Uses egg to make loop
float roundLoop4( vec2 uv, float w) {
  float s1 = sdOval2( uv - vec2(0.0, 0.30));
  float m1 = S(0.008, 0.0, s1);
   // Change angle to change arc sin(.45), cos(.90)
   // Second parameters determines placement 
  float s2 = abs(sdArc(  uv - vec2(0.0, 0.26), vec2( sin(.45), cos(.90) ), .5, .6)) - .035;
  float m2 = S(0.008, 0.0, s2);
  // Add a box to eliminate curved part of arc at edges
  float s3 = sdBox ( uv - vec2( -0.35, -0.05), vec2(0.15, 0.135));
  float m3 = S(0.008, 0.0, s3);
  float s4 = sdBox ( vec2(uv.x, uv.y) - vec2( 0.35, -0.05), vec2(0.15, 0.135));
  float m4 = S(0.008, 0.0, s4);
  float mm1 = m2 - min(m2, m3) - min(m2, m4);
  // Note:  altering (x,y) position is counter-intuitive
  // b/c there is a rotation, change uv.x to alter vertical pos, uv.y to alter horizontal pos
  float s5 = sdTrapezoid( (Rot(PI*2./4.) * uv) - vec2(-0.03, 0.35), .035, .05, .15);
  float m5 = S(0.008, 0.0, s5);
  float s6 = sdTrapezoid( (Rot(PI*2./4.) * uv) - vec2(-0.03, -0.35), .05, .035, .15);
  float m6 = S(0.008, 0.0, s6);
  float mm2 = 1. - m1;
  float mm3 =  mm1 + mm2 - min(mm1, mm2);
  float mm4 = m5 + m6;
  return mm3 + mm4 - min(mm3, mm4);
}

// // NE, SE, NW, SW
float roundLoop5( vec2 uv ) {
   float s1 = abs(sdRoundedBox( uv - vec2(0.0, 0.0), vec2(.25, .25), vec4(0.25, 0.0, 0.25, 0.25))) - 0.035;
   float m1 = S(0.008, 0.0, s1);
   float s2 = sdMoon(Rot(-PI*1./5.)*uv, .09, .23, .23);
   float m2 = S(0.008, 0.0, s2);
  return m1 + m2 - min(m1, m2);
}

// Fat sides
// NE, SE, NW, SW
float roundLoop6( vec2 uv ) {
   float s1 = abs(sdCircle( uv - vec2(0.0, 0.075), .30)) - 0.025;
   //float s1 = abs(sdRoundedBox( uv - vec2(0.0, 0.0), vec2(.25, .25), vec4(0.25, 0.0, 0.25, 0.25))) - 0.035;
   float m1 = S(0.008, 0.0, s1);
   float s2 = sdMoon(Rot(PI*0./4.)*uv - vec2(-0.05, 0.075), .15, .275, .275);
   float m2 = S(0.008, 0.0, s2);
   float mm1 =  m1 + m2 - min(m1, m2);
   float s3 = sdMoon(Rot(PI)*uv - vec2(-0.05, -0.075), .15, .275, .275);
   float m3= S(0.008, 0.0, s3);
   float mm2 = m1 + m3 - min(m1, m3);
   float s4 = abs(sdArc(  uv - vec2(0.0, 0.07), vec2( sin(.15), cos(.90) ), .5, .6)) - .035;
   float m4 = S(0.008, 0.0, s4);
   // Add a box to eliminate curved part of arc at edges
   float s5 = sdBox ( uv - vec2( -0.35, -0.05), vec2(0.15, 0.135));
   float m5 = S(0.008, 0.0, s5);
   float s6 = sdBox ( vec2(uv.x, uv.y) - vec2( 0.35, -0.05), vec2(0.15, 0.135));
   float m6 = S(0.008, 0.0, s6);
  //  float s4= sdTrapezoid( (Rot(PI*2./4.) * uv) - vec2(-0.25, 0.345), .04, .05, .35);
  //  float m4 = S(0.008, 0.0, s4);
  //  float s5 = sdTrapezoid( (Rot(PI*2./4.) * uv) - vec2(-0.25, -0.345), .05, .04, .35);
  //  float m5 = S(0.008, 0.0, s5);
  return mm1 + mm2 - min(mm1, mm2) + m4 ;
}
// tilted with a fatter top
// // NE, SE, NW, SW
float roundLoop( vec2 uv ) {
   float s1 = abs(sdRoundedBox( uv - vec2(0.0, 0.0), vec2(.25, .25), vec4(0.25, 0.0, 0.25, 0.25))) - 0.05;
   float m1 = S(0.008, 0.0, s1);
   float s2 = sdMoon(Rot(-PI*2.5/10.0)*uv, 0.09, 0.21, .21);
   float m2 = S(0.008, 0.0, s2);
   float mm1 = m1 + m2 - min(m1, m2);
   float s3 = sdBox( uv - vec2(0.25, -0.25), vec2(0.05, 0.25));
   float m3 = S(0.008, 0.0, s3);
   float s4 = sdBox( uv - vec2(0.25, -0.25), vec2(0.25, 0.05));
   float m4 = S(0.008, 0.0, s4);
   float mm2 = m3 + m4 - min(m3, m4);
  return mm1 + mm2 - min(mm1, mm2);
}

// Small circle with loop
// // NE, SE, NW, SW
float sdCircleLoop( vec2 uv ) {
  float s1 = sdEgg( (Rot(-PI * 3./4.) * uv) - vec2(0.0, 0.02), .25, .075);
  float m1 = S(0.008, 0.0, s1);
  float s2 = sdEgg( (Rot(-PI * 3./4.) * uv) - vec2(0.0, 0.02), .15, .015);
  float m2 = S(0.008, 0.0, s2);
  float s3 = sdBox( uv - vec2(0.25, -0.4), vec2(0.05, 0.20));
  float m3 = S(0.008, 0.0, s3);
  float s4 = sdBox( uv - vec2(0.4, -0.25), vec2(0.20, 0.05));
  float m4 = S(0.008, 0.0, s4);
  float s5 = abs(sdCircle( uv - vec2(-0.5, 0.5), 0.25)) - 0.05;
  float m5 = S(.008, .0, s5);
  float mm1 = m1 - m2;
  float mm2 = m3 + m4 - min(m3, m4);
  return mm1 + mm2 - min(mm1, mm2) + m5;
}

// NE, SE, NW, SW
float tiltedLoop( vec2 uv ) {
  float s1 = abs(sdRoundedBox( uv - vec2(0.0, 0.0), vec2(.25, .25), vec4(0.25, 0.0, 0.0, 0.25))) - 0.05;
  float m1 = S(0.008, 0.0, s1);
  float s2 = sdBox( uv- vec2(0.25, -0.35), vec2(0.05, .15));
  float m2 = S(0.008, 0.0, s2);
  float s3 = sdBox( uv- vec2(0.35, -0.25), vec2(.15, 0.05));
  float m3 = S(0.008, 0.0, s3);
  float mm = m1 + m2 - min( m1, m2 );
  return mm + m3 - min(mm, m3);
}

// NE, SE, NW, SW
float tiltedLoop2( vec2 uv ) {
  float s1 = abs(sdRoundedBox( uv - vec2(0.0, 0.0), vec2(.25, .25), vec4(0.25, 0.0, 0.0, 0.25))) - 0.05;
  float m1 = S(0.008, 0.0, s1);
  float s2 = sdMoon(Rot(-PI*1./4.)*uv - vec2(-0.15, 0.0), .15, .2, .2);
  float m2 = S(0.008, 0.0, s2);
  float mm1 =  m1 + m2 - min(m1, m2);
  float s3 = sdBox( uv- vec2(0.25, -0.35), vec2(0.026, .15));
  float m3 = S(0.008, 0.0, s3);
  float s4 = sdBox( uv- vec2(0.35, -0.25), vec2(.15, 0.05));
  float m4 = S(0.008, 0.0, s4);
  float s5 = sdBox( uv- vec2(0.25, -0.35), vec2(0.05, .15));
  float m5 = S(0.008, 0.0, s5);
  float s6 = sdBox( uv- vec2(0.35, -0.25), vec2(.15, 0.05));
  float m6 = S(0.008, 0.0, s6);
  float mm2 = m5 + m6 - min(m5,m6);
  return mm1 + mm2 - min(mm1,mm2);
}

float doubleRdLoop( vec2 uv) {
  vec2 st = 1.5*uv;
  float s1 = roundLoop5(st- vec2(-0.325, 0.1));
  float m1 = S(0.008, 0.0, s1);
  float s2 = roundLoop5(vec2(-st.x, st.y) - vec2(-0.325, 0.1));
  float m2 = S(0.008, 0.0, s2);
  float s3 = sdBox( uv - vec2(-0.05, -0.20), vec2(0.025, .27));
  float m3 = S(0.008, 0.0, s3);
  float s4 = sdBox( uv - vec2(0.05, -0.20), vec2(0.025, .27));
  float m4 = S(0.008, 0.0, s4);
  float s5 = sdBox( uv - vec2(0.0, -0.1), vec2(0.05, 0.025));
  float m5 = S(0.008, 0.0, s5);
  float mm = 1. - min(m1, m2);
  float mm1 = m1 + m2 + m5 - min(m1 + m2, m5);
  return mm  + min(m1, m3) + min(m2, m4) ;//+ mm1;
 
}
float doubleRdLoop( vec2 uv, float w ) {
  uv = vec2( abs(uv.x), uv.y );
  float s1 = sdOval( uv - vec2(0.25, 0.0), .175, 0.16);
  float m1 = S(0.008, 0.0, s1);
  float s2 = sdBox( uv - vec2(0., 0.0), vec2(0.25, 0.5));
  float m2 = S(0.008, 0.0, s2);
  float s3 = sdOval( uv - vec2(0.25, 0.085), .0875, 0.08);
  float m3 = S(0.008, 0.0, s3);
  float s4 = sdBox( uv - vec2(0.5, 0.0), vec2(0.25, 0.5));
  float m4 = S(0.008, 0.0, s4);
  float s5 = sdBox( uv - vec2(0.135, 0.014), vec2(0.135, .01 ));
  float m5 = S(0.008, 0.0, s5);
  float s6 = sdBox ( uv - vec2(0.29, -0.165), vec2(.05, 0.005));
  float m6 = S(0.008, 0.0, s6);
  float mm1 = min(m1, m2);
  float mm2 = min(m3, m4);
  float mm3 = mm2 + m5 - smin(mm2, m5, .5);
  return mm1 + mm3 - min(mm1, mm3) + m6;
}

// // Choose shape
vec3 chooseShape( float shapechoice, vec2 uv, vec3 col1, vec3 col2 ) {
  vec3 col = vec3(0.0);
//   // vec3 bkcol = chooseColor( col1 ); 
//   // vec3 shapecol = chooseColor( col2 );
       
   if (shapechoice == 0.0) {
     col = col1;
   }
    //  Large Square Loop
   else if (shapechoice == 1.0) {
    float ls = sdLrgSqLoop( uv, 0.0, 0.0, 0.025, 0.1);
    col += (1. - ls) * col1 + ls * col2;
    }  
    // Small square loop
  else if (shapechoice == 2.0) {
    float ss = sdSmSqLoop(uv, 0.0, 0.0, 0.025, 0.1);
    col += (1. - ss) * col1 + ss * col2;
  }
   //  loops
  else if (shapechoice == 3.0) {
    float rl6 = roundLoop6( uv );
     col += (1. - rl6) * col1 + rl6 * col2;
  }
  // Double square loops -- skinny verticals
  else if (shapechoice == 4.0) {
    float ds2 = doubleSquareLoops2( uv - vec2(0.0, -0.06), 0.0, 0.0);
     col += (1. - ds2) * col1 + ds2 * col2;
  }
 else if (shapechoice == 5.0) {
     // one corner circle
    float sc = sdSmallCircle( uv  );
     col += (1. - sc) * col1 + sc * col2;
 }
 else if (shapechoice == 6.0) {
     // Two corner circles
    float bc = sdBigCircle(uv );
    col += (1. - bc) * col1 + bc * col2;
  }
else if (shapechoice == 7.0) {
     // Two corner circles
    float bc2 = sdBigCircles(uv );
    col += (1. - bc2) * col1 + bc2 * col2;
  }
  else if (shapechoice == 8.0) {
     // Round loop with fatter tails, taller loop
    float rl4 = roundLoop4(uv - vec2(0.0, -0.22), 0.25 );
    col += (1. - rl4) * col1 + rl4 * col2;
  }
  else if (shapechoice == 9.0) {
     // Round loop fat top
    float rl = roundLoop( uv );
    col += (1. - rl) * col1 + rl * col2;
  }
  else if (shapechoice == 10.0) {
     // Round Loop fat sides
    float rl5 = roundLoop5( uv );
    col += (1. - rl5) * col1 + rl5 * col2;
  }
  else if (shapechoice == 11.0) {
     // Tilted Loop 
    float tl2 = tiltedLoop( uv );
    col += (1. - tl2) * col1 + tl2 * col2;
  }
  else if (shapechoice == 12.0) {
     // Tilted Loop 2
    float tl2 = tiltedLoop2( uv );
    col += (1. - tl2) * col1 + tl2 * col2;
  }
 // Kink
else if (shapechoice == 13.0) {
    float k1 = sdKink1(uv);
    col += (1. - k1) * col1 + k1 * col2;
  }
else if (shapechoice == 14.0) {
    float k2 = sdLockingSq(uv);
    col += (1. - k2) * col1 + k2 * col2;
  }
else if (shapechoice == 15.0) {
    float sbc = sdSmallCorner(uv);
    col += (1. - sbc) * col1 + sbc * col2;
  }
else if (shapechoice == 16.0) {
    float lc = sdLargeCorner(uv);
    col += (1. - lc) * col1 + lc * col2;
  }
else if (shapechoice == 17.0) {
    float scs = sdSmallCorners(uv);
    col += (1. - scs) * col1 + scs * col2;
  }
  else if (shapechoice == 18.0) {
    float cl = sdCircleLoop(uv);
    col += (1. - cl) * col1 + cl * col2;
  }
 return col;
}

void main()
{
  vec2 uv = (gl_FragCoord.xy - .5*u_resolution.xy)/u_resolution.y;
  
  vec3 col = vec3(0.0);
  
  vec3 cs = checkSymmetry( uv );
  
 col += cs;
  //   vec3 bkcol = chooseColor( bkcolor ); 
  //   vec3 shapecol = chooseColor( shapecolor );
    col += chooseShape( 18.0, uv, LTGREY, TEAL );
   // vec2 st = vec2(abs(uv.x), uv.y);
    //float m = sdSquareLoops( uv, 0.0, 0.0 );
    // float m = sdRoundLoop( uv - vec2(0.0, 0.05), 0.16 );
    // float m = sdSmSqLoop( uv, 0.0, .0, .025, .1);
    // col += (1. - m) * LTGREY + m * TEAL;


  gl_FragColor = vec4(col,1.0);
}
