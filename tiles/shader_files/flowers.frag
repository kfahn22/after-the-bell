// Frag shader creates tiles for wave function collapse

#ifdef GL_ES
precision mediump float;
#endif

// Pass in uniforms from the sketch.js file
uniform vec2 u_resolution; 
uniform float rValue;
uniform float gValue;
uniform float bValue;
#define color vec3(rValue, gValue, bValue)/255.

#define S smoothstep
#define CG colorGradient
#define PI 3.14159

#define PURPLE vec3(156,82,139)/255.
#define PINK vec3(247,178,183)/255.
#define GREEN vec3(183,206,99)/255.
#define NAVY vec3(32,6,59)/255.

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

// sdf functions for shapes from Inigo Quilez
float sdSegment( vec2 uv, vec2 a, vec2 b) {
  vec2 pa = uv-a, ba = b-a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa-ba*h );
}

float sdCircle( vec2 uv, float r) {
  return length(uv) - r;
} 

float sdEllipse( in vec2 p, in vec2 ab )
{
    p = abs(p); if( p.x > p.y ) {p=p.yx;ab=ab.yx;}
    float l = ab.y*ab.y - ab.x*ab.x;
    float m = ab.x*p.x/l;      float m2 = m*m; 
    float n = ab.y*p.y/l;      float n2 = n*n; 
    float c = (m2+n2-1.0)/3.0; float c3 = c*c*c;
    float q = c3 + m2*n2*2.0;
    float d = c3 + m2*n2;
    float g = m + m*n2;
    float co;
    if( d<0.0 )
    {
        float h = acos(q/c3)/3.0;
        float s = cos(h);
        float t = sin(h)*sqrt(3.0);
        float rx = sqrt( -c*(s + t + 2.0) + m2 );
        float ry = sqrt( -c*(s - t + 2.0) + m2 );
        co = (ry+sign(l)*rx+abs(g)/(rx*ry)- m)/2.0;
    }
    else
    {
        float h = 2.0*m*n*sqrt( d );
        float s = sign(q+h)*pow(abs(q+h), 1.0/3.0);
        float u = sign(q-h)*pow(abs(q-h), 1.0/3.0);
        float rx = -s - u - c*4.0 + 2.0*m2;
        float ry = (s - u)*sqrt(3.0);
        float rm = sqrt( rx*rx + ry*ry );
        co = (ry/sqrt(rm-rx)+2.0*g/rm-m)/2.0;
    }
    vec2 r = ab * vec2(co, sqrt(1.0-co*co));
    return length(r-p) * sign(p.y-r.y);
}

float sdHalfFlower( vec2 uv, vec2 offset  ) {
  vec2 gv = uv - offset;
  float s1= sdCircle(gv - vec2(0.0, 0.0), 0.1);
  float m1 = S(.008, .0, s1);
  float s2 = sdEllipse(Rot(PI * 0./4.) * vec2(gv.x, abs(gv.y)) - vec2(0.0, 0.3), vec2(.04, .19));
  float m2 = S(.008, .0, s2);
  float s3 = sdEllipse(Rot(PI * 2./8.) * vec2(gv.x, abs(gv.y)) - vec2(0.0, 0.30), vec2(.04, .19));
  float m3 = S(.008, .0, s3);
   float s4 = sdEllipse(Rot(PI * 2./4.) * vec2(gv.x, abs(gv.y)) - vec2(0.00, 0.3), vec2(.04, .19));
  float m4 = S(.008, .0, s4);
   float s5 = sdEllipse(Rot(PI * 1.5/12.) * vec2(gv.x, abs(gv.y)) - vec2(0.0, 0.3), vec2(.04, .20));
  float m5 = S(.008, .0, s5);
    float s6 = sdEllipse(Rot(PI * 4.5/12.) * vec2(gv.x, abs(gv.y)) - vec2(0.00, 0.3), vec2(.04, .19));
  float m6 = S(.008, .0, s6);
  
  return  m1 + m2 + m3  + m4  + m5 + m6;
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
    float l3 = S(.008, .0, d3); // vertical  line at .25
    float d4 = sdSegment(uv, vec2(-.5, .1), vec2(0.5, .1));
    float l4 = S(.008, .0, d4); //horizontal line at .25
   // col += l1 + l2  + l4;
  
   // Change a (angle) to get Up, Down, Right, Left
   // a = 0. vertical, a = 1. horizontal
   float a = 3.; //  Right 0., Up  1., Left 2., Down 3. 
  
 
  float angle = 0.;
   vec2 gv = Rot(angle) * uv;
 
  float s = sdHalfFlower(uv, vec2(0.5, 0.0));
  float m = S(0.008, 0.0, s);
  

 
//col += (1. - m) * PURPLE + m * NAVY;
 // col += (1. - m) * NAVY + m * PURPLE;
  col = NAVY + m * PURPLE;
  
 
 


  
    gl_FragColor = vec4(col,1.0);
}
