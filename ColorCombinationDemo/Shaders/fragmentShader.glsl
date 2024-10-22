precision mediump float;

uniform vec4 uOverlayColor;
uniform sampler2D uSampler;

varying vec2 vTexCoord;

void main(void) {
    vec4 baseColor = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    float newAlpha = uOverlayColor.w + (1.0 - uOverlayColor.w) * baseColor.w;
    gl_FragColor = (uOverlayColor.w * uOverlayColor + (1.0 - uOverlayColor.w) * baseColor.w * baseColor) / newAlpha;
}