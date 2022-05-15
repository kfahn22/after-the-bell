// Frag shader creates train tiles for wave function collapse

#ifdef GL_ES
precision mediump float;
#endif

// Pass in resolution from the sketch.js file
uniform vec2 u_resolution; 
uniform float bkcolor;
uniform float railcolor;
uniform float trackcolor;
uniform float trackchoice;

#define S smoothstep
#define CG colorGradient
#define PI 3.14159

// Coding train colors
#define AQUA vec3(160,223,247)/255.
#define RASPBERRY vec3(253,96,182)/255.
#define PURPLE vec3(196,103,236)/255.

#define GREEN vec3(83,255,69)/255.
#define GREY vec3(89,89,89)/255.
#define BLUE vec3(30,46,222)/255.

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

// From Inigo Quilez
float sdRoundedBox( vec2 uv, vec2 b, vec4 r) {
  r.xy = (uv.x>0.0) ? r.xy : r.zw;
  r.x = (uv.y>0.0) ? r.x : r.y;
  vec2 q = abs(uv) - b + r.x;
  return min( max(q.x, q.y), 0.0) + length(max(q, 0.0) ) - r.x;
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
      colchoice = GREY;
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





// Choose track
vec3 chooseTrack( float choice, vec2 uv, vec3 col1, vec3 col2, vec3 col3 ) {
  vec3 col = vec3(0.0);
  // vec3 bkcol = chooseColor( col1 ); 
  // vec3 railcol = chooseColor( col2 );
  // vec3 trackcol = chooseColor( col3 );

   if (trackchoice == 0.0) {
     col = col1;
   }
   if (trackchoice == 1.0) {
    float crTR = crossTrackRail(uv, -0.075, 0.075);
    float str = crosstracks(uv, 0.0); 
    
    // Cross track
    float rotcrTR = crossTrackRail(Rot(PI*2./4.)*uv, -0.075, 0.075);
    float bb = max(crTR, rotcrTR);
    float strr = crosstracks(Rot(PI*2./4.)*uv, 0.0); 
    col += (1. - bb  - str - strr) * col1 + bb * col2 + (str + strr) * col3;
  }
  else if (trackchoice == 2.0) {
    // Curved track
    float bc = biggerCurvedRails(uv);
    float ctr = ctracks(uv); 
    col += (1. - bc - ctr) * col1 + bc * col2 + ctr * col3;
  }
  else if (trackchoice == 3.0) {
    // junction track
    float bcn = tConnect(Rot(PI*0./4.)*uv, -0.075, 0.075);
    float tct = tcTracks(uv, 0.0);
    col += (1. - bcn - tct) * col1 + bcn * col2 +  tct * col3;
  }
 else if (trackchoice == 4.0) {
     // center corner connector
    float ccn = quarterCurve(Rot(PI*0./4.)*uv, -0.075, 0.075);
    float ct = qcTracks(uv, 0.0);
    col += (1. - ccn - ct) * col1 + ccn * col2 +  ct * col3;
 }
 else if (trackchoice == 5.0) {
     // Side train rails
    float side = biggerRails(uv, -0.42, -0.275);
  
    // Side train tracks
    float sstr = stracks(uv, -0.35); 
    col += (1. - side - sstr) * col1 + side * col2 + sstr * col3;
 }
 else if (trackchoice == 6.0) {
     // Smaller train tracks
     float t = sdTrack(uv, .001);
     col += (1. - t) * col1 + t * col2;
 }
 else if (trackchoice == 7.0) {
    // Straight train tracks
    float b = biggerRails(uv, -0.075, 0.075);
    float str = stracks(uv, -.0); 
    col += (1. - b - str) * col1 + b * col2 + str * col3;
 }
 return col;
}

void main()
{
  vec2 uv = (gl_FragCoord.xy - .5*u_resolution.xy)/u_resolution.y;
  
  vec3 col = vec3(0.0);
  vec3 bkcol = chooseColor( bkcolor ); 
  vec3 railcol = chooseColor( railcolor );
  vec3 trackcol = chooseColor( trackcolor );

  col += chooseTrack( trackchoice, uv, bkcol, railcol, trackcol );
  gl_FragColor = vec4(col,1.0);
}
