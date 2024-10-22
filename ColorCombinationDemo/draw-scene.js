import { camView, viewPos } from "./cameraSphere.js";
import { defaultIcon } from "./webGL-demo.js";

let overlayColor = [1.0, 1.0, 1.0, 1.0];
let vertCount = 0;

function drawScene(gl, programInfo, buffers) {
  requestAnimationFrame(function() {drawScene(gl, programInfo, buffers);});
  const overlayR = document.getElementById("sliderRed");
  overlayColor[0] = overlayR.value;
  const overlayG = document.getElementById("sliderGreen");
  overlayColor[1] = overlayG.value;
  const overlayB = document.getElementById("sliderBlue");
  overlayColor[2] = overlayB.value;
  const overlayA = document.getElementById("sliderAlpha");
  overlayColor[3] = overlayA.value;
  // set up viewport state and claer it
  gl.clearColor(overlayColor[0], overlayColor[1], overlayColor[2], overlayColor[3]); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything from depth 0 to 1 (so everything lol)
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // set attributes for our projection matrix
  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // create the projection matix 
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  mat4.multiply(projectionMatrix, projectionMatrix, camView);

  // set the 'origin' or draw point for objects
  const modelViewMatrix = mat4.create();

  // translate origin to the 'middle' of the screen
  mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);
  //console.log(viewPos);

  // Tell webgl how to read the vertex postions from the buffer
  setPositionAttribute(gl, buffers, programInfo);
  setTexAttribute(gl, buffers, programInfo);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // put projection and model view matrix into the program (into the shader programs)
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
  gl.uniform4fv(programInfo.uniformLocations.overlayColor, overlayColor);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, defaultIcon)
  gl.uniform1i(programInfo.uniformLocations.textureSample, 0)

  //draw the object
  const vertexCount = vertCount;
  const type = gl.UNSIGNED_SHORT;
  const offset = 0;
  gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
}

// Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute.
function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 4; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  vertCount = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE) / 16;
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setTexAttribute(gl, buffers, programInfo) {
  const numComponents = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoords);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexTextureCoord,
    numComponents,
    type,
    normalize,
    stride,
    offset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexTextureCoord);
}

export { drawScene, overlayColor };
