// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform float time;

vec3 colorA = vec3(1.000,0.739,0.758);
vec3 colorB = vec3(0.606,0.800,1.000);

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) - 
          smoothstep( pct, pct+0.01, st.y);
}

void main() {
    vec2 st = vUv;

    vec3 color = vec3(0.);
  
    float y = sin(st.y + sin(time));

    vec3 pct = vec3(y);
    
    pct.r = smoothstep(0.0,1.0, y);
    // pct.b = sin(y*PI);
    // pct.b = pow(st.x,0.5);

    color = mix(colorA, colorB, pct);

    gl_FragColor = vec4(color,1.0);
}