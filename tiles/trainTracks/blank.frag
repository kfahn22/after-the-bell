// Frag shader creates train tiles for wave function collapse

#ifdef GL_ES
precision mediump float;
#endif

// Pass in resolution from the sketch.js file
uniform vec2 u_resolution; 

#define AQUA vec3(160,223,247)/255.
#define RASPBERRY vec3(253,96,182)/255.
#define PURPLE vec3(196,103,236)/255.

void main()
{
    vec2 uv = (gl_FragCoord.xy - .5*u_resolution.xy)/u_resolution.y;
    vec3 col = vec3(0.);
    col += AQUA;  // blank tile
    gl_FragColor = vec4(col,1.0);
}
