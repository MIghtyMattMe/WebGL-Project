const vsSource = `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;
varying vec2 vTexCoord;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
    vTexCoord = aTexCoord;
}
`;

const fsSource = `
precision mediump float;

uniform vec4 uOverlayColor;
uniform sampler2D uSampler;

varying lowp vec4 vColor;
varying vec2 vTexCoord;

void main(void) {
    vec4 baseColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    baseColor.xyz = (baseColor.xyz + (vColor.xyz * vColor.w)) / 2.0;
    baseColor.xyz = baseColor.xyz * baseColor.w;
    float newAlpha = uOverlayColor.w + (1.0 - uOverlayColor.w) * baseColor.w;
    gl_FragColor = (uOverlayColor.w * uOverlayColor + (1.0 - uOverlayColor.w) * baseColor.w * baseColor) / newAlpha;
}
`;
export { vsSource, fsSource }