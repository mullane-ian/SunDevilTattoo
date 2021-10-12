varying vec2 vUv;
uniform sampler2D uTexture;

void main()	{
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);


	vec4 color = texture2D(uTexture,vUv);
	gl_FragColor = color;

}