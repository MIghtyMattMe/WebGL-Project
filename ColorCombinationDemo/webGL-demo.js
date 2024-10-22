import { drawScene, overlayColor } from "./draw-scene.js";
import { vsSource, fsSource } from "./shaders.js"
import { setUpCam } from "./cameraSphere.js";
import { ImportOBJ, indexBuffer, vertexBuffer, textureBuffer } from "../ImportExportScripts/ImportOBJ.js";

let programData;
let defaultIcon;
window.onload = initEverything().then(() => {drawScene(programData.gl, programData.programInfo, programData.buffers);});
main();

function main() {
  // Draw the scene
  //drawScene(programData.gl, programData.programInfo, programData.buffers);
}

async function initEverything() {
  await ImportOBJ("../Objects/Test.obj");
  //create gl context
  const canvas = document.getElementById("glcanvas");
  const gl = canvas.getContext("webgl");
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return null;
  }
  setUpCam(canvas);

  //create all shaders, glPrograms, and lookup locations
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    return null;
  }

  const programInfo = {
    program: shaderProgram,
    attribLocations: { 
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexTextureCoord: gl.getAttribLocation(shaderProgram, "aTexCoord")
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      overlayColor: gl.getUniformLocation(shaderProgram, "uOverlayColor"),
      textureSample: gl.getUniformLocation(shaderProgram, "uSampler")
    }
  };

  //buffers for positions, colors, etc
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = vertexBuffer;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  console.log(positions);

  const objIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objIndexBuffer);
  const indices = indexBuffer;
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW,);
  console.log(indices);

  //create textures and upload texture data
  defaultIcon = gl.createTexture();
  defaultIcon.image = new Image();
  defaultIcon.image.onload = function() {
    loadImage(gl, defaultIcon);
  }
  defaultIcon.image.src = "../Textures/DefaultIcon.png"

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  var textureCoords = textureBuffer;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW)
  console.log(textureCoords);
  
  const buffers = {
    position: positionBuffer,
    indices: objIndexBuffer,
    textureCoords: texCoordBuffer
  };

  //return the program data
  programData = {
    gl: gl,
    programInfo: programInfo,
    buffers: buffers
  }

  return programData;
}

function updateRender() {
  //clear and set viewport state
  //for each object:
  //  select a program to use
  //  set up attributes/bind buffers
  //  set up uniforms and textures
  //  draw arrays/elements
}

function loadImage(gl, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export {defaultIcon}