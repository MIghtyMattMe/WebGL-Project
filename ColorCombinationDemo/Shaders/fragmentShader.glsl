precision mediump float;
uniform vec4 uOverlayColor;
varying lowp vec4 vColor;

void main(void) {
    gl_FragColor.xyz = uOverlayColor.w * uOverlayColor.xyz + (1.0 - uOverlayColor.w) * vColor.xyz;
    gl_FragColor.w = 1.0;
}