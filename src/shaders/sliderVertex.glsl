varying vec2 vUv;
uniform float time;
uniform float uDistance;
float PI = 3.14159265;
void main() {
  vUv = (uv - vec2(0.5))*(1.-0.1*uDistance*(2. - uDistance)) + vec2(0.5);

  vec3 pos = position;
  pos.y +=sin(PI*uv.x)*0.01;
  pos.z +=sin(PI*uv.x)*0.05;


  pos.y += sin(time * 0.3) * .02;
  vUv.x -= sin(time) * .02;
  vUv.y -= sin(time*0.3) * .02;



  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}