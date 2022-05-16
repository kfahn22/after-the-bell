// Frag shader creates train tiles for wave function collapse

#ifdef GL_ES
precision mediump float;
#endif

// Pass in resolution from the sketch.js file
uniform vec2 u_resolution; 
uniform float bkcolor;
uniform float shapecolor;
uniform float shapechoice;
//#define shapechoice 3.0;

#define S smoothstep
#define CG colorGradient
#define PI 3.14159

// Coding train colors
#define AQUA vec3(160,223,247)/255.
#define RASPBERRY vec3(253,96,182)/255.
//#define PURPLE vec3(196,103,236)/255.

#define GREEN vec3(83,255,69)/255.
#define GREY vec3(89,89,89)/255.
#define BLUE vec3(30,46,222)/255.

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

// diamond-like shape
float diamond( vec2 uv ) {
   float s1 = sdCircle(uv - vec2(.50, .50), .495) ;
   float m1 = S(.008, 0., s1);
   float s2 = sdCircle(uv - vec2(.5, -.5), .495) ;
   float m2 = S(.008, 0., s2);
   float s3 = sdCircle(uv - vec2(-.50, .50), .495) ;
   float m3= S(.008, 0., s3);
   float s4 = sdCircle(uv - vec2(-.50, -.50), .495);
   float m4 = S(.008, 0., s4);
   return m1 + m2 + m3 + m4;
}

// Half Circle
float halfCircle( vec2 uv) {
  float s = sdCircle(uv - vec2(.0, .50), .495);
  float m = S(.008, 0., s);
  return m;
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
    return m;
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

float circleCross( vec2 uv) {
    float s1 = cross(uv);
    float m1 = S(.008, 0., s1);
    float s2 = sdCircle(uv - vec2(0.0, 0.0), .35 );
    float m2 = S(.008, 0., s2);
    return min( m1, m2);
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
   // 'lens'
  float lens( vec2 uv) {
    float s = sdCircle(uv - vec2(.33, .0), .75);
    float m = S(.008, 0., s);
    return m;
   }
  
  float circleArc( vec2 uv) {
      float s = sdCircle(uv - vec2(.5, -.5), .995);
      float m = S(.008, 0., s);
      return m;
  }

   //Circles in corners
   float cornerCircles( vec2 uv) {
      float s1 = sdCircle(uv - vec2(.25, .25), .495) ;
      float m1 = S(.008, 0., s1);
      float s2 = sdCircle(uv - vec2(.25, -.25), .495) ;
      float m2 = S(.008, 0., s2);
      float s3 = sdCircle(uv - vec2(-.25, .25), .495) ;
      float m3 = S(.008, 0., s3);
      float s4 = sdCircle(uv - vec2(-.25, -.25), .495);
      float m4 = S(.008, 0., s4);
      float mm1 = max(m1, m2);
      float mm2 = max(m3, m4);
      return 1. - (mm1,  mm2); 
   }

//  // Circles in corners
// float cornerCircles( vec2 uv) {
//   vec2 st = abs(uv);
//   vec3 s = sdCircleCorner(uv, .025, BLUE, GREEN, RASPBERRY);
//   col += c4;
// }

// Choose shape
vec3 chooseShape( float choice, vec2 uv, vec3 col1, vec3 col2 ) {
  vec3 col = vec3(0.0);
  // vec3 bkcol = chooseColor( col1 ); 
  // vec3 shapecol = chooseColor( col2 );

   if (shapechoice == 0.0) {
     col = col1;
   }
    //  Half circle
   else if (shapechoice == 1.0) {
    float hc = halfCircle(uv);
    col += (1. - hc) * col1 + hc * col2;
    }  
    // Lens
  else if (shapechoice == 2.0) {
    float l = lens(uv);
    col += (1. - l) * col1 + l * col2;
  }
  else if (shapechoice == 3.0) {
    // Column
    float c = column(uv);
     col += (1. - c) * col1 + c * col2;
  }
 else if (shapechoice == 4.0) {
     // Diamond
    float d = diamond(uv);
     col += (1. - d) * col1 + d * col2;
 }
 else if (shapechoice == 5.0) {
     // Junction
    float j = junction(uv);
    col += (1. - j) * col1 + j * col2;
  }
  // Cross 
else if (shapechoice == 6.0) {
    float cr = cross(uv);
    col += (1. - cr) * col1 + cr * col2;
  }
 return col;
}

void main()
{
  vec2 uv = (gl_FragCoord.xy - .5*u_resolution.xy)/u_resolution.y;
  
  vec3 col = vec3(0.0);
 // Uncomment to check for symmetry
    float d1 = sdSegment(uv, vec2(-.5, .0), vec2(0.5, .0));
    float l1 = S(.008, .0, d1); // horizontal center line
    float d2 = sdSegment(uv, vec2(0., -.5), vec2(0., .5));
    float l2 = S(.008, .0, d2); // vertical center line
    float d3 = sdSegment(uv, vec2(.25, .5), vec2(.25, -.5));
    float l3 = S(.008, .0, d3); // vertical center line
    //col += l1 + l2  + l3;
  
  vec3 bkcol = chooseColor( bkcolor ); 
  vec3 shapecol = chooseColor( shapecolor );
  col += chooseShape(3.0, uv, bkcol, shapecol );

  gl_FragColor = vec4(col,1.0);
}
