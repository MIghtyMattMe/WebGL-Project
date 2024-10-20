let over = false;
let clicked = false;
let pos = {
    x: -1.5,
    y: -1.5
};
let viewPos = [0, 0, 0];
let radius = 6;
let camView = mat4.create();
function setUpCam(canvas) {
    // Camera will only move while the mouse is over it and left clicked
    canvas.addEventListener("mouseenter", (e) => {over = true;});
    canvas.addEventListener("mouseleave", (e) => {over = false; clicked = false;});
    canvas.addEventListener("mousedown", (e) => {
        if (e.button == 0) clicked = over;
    });
    canvas.addEventListener("mouseup", (e) => {
        if (e.button == 0) clicked = false;
    });
    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            pos.x += e.movementX / 100;
            pos.y += e.movementY / 100;
            pos.y = Math.max(-2.7, Math.min(pos.y, -0.4));
            changeCamView();
        }
    });
}

function changeCamView() {
    viewPos[0] = radius * Math.cos(pos.x) * Math.sin(pos.y);
    viewPos[2] = (radius * Math.sin(pos.x) * Math.sin(pos.y)) - 6;
    viewPos[1] = radius * Math.cos(pos.y);
    mat4.lookAt(camView, viewPos, [0, 0, -6], [0, 1, 0]);
}

export {setUpCam, camView, viewPos};
