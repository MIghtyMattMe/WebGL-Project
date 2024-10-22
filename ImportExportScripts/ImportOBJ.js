let vertexArray;
let normalArray;
let textureArray;
let vertexBuffer;
let normalBuffer;
let textureBuffer;
let indexBuffer;

async function ImportOBJ(filelocation) {
    //find the file and get it's data
    const response = await fetch(filelocation);
    const result = await response.text();

    //clear arrays for new data
    vertexArray = [];
    normalArray = [];
    textureArray = [];
    vertexBuffer = [];
    normalBuffer = [];
    textureBuffer = [];
    indexBuffer = [];

    var fileIndex = 0;
    var nextIndexInFile = 0;
    var lineNumber = 0;
    var OBJData = "";

    //gets a single line from the .obj file
    while (nextIndexInFile != -1) {
        lineNumber++;
        nextIndexInFile = result.indexOf("\n", fileIndex);
        OBJData = nextIndexInFile != -1 ? result.substring(fileIndex, nextIndexInFile) : result.substring(fileIndex);
        fileIndex = nextIndexInFile + 1;
        console.log(OBJData);
        //split the data into it's parts and read it
        readData(OBJData.split(' '), lineNumber);
    }
    //console.log(indexBuffer);
    //console.log(vertexBuffer);
}

function readData(data, line) {
    var args = data.length;
    switch (data[0]){
        case 'v':
            if (args < 4 || args > 5) {
                console.error("corrupted position at line:" + line);
                //throw error and end program
                return;
            }
            vertexArray.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
            //check for optional w component and fill in if missing
            if (args == 5) {
                vertexArray.push(parseFloat(data[4]));
            } else {
                vertexArray.push(1.0);
            }
            break;
        case 'vt':
            if (args == 2) {
                textureArray.push(parseFloat(data[1]), 0);
            } else if (args == 3) {
                textureArray.push(parseFloat(data[1]), parseFloat(data[2]));
            } else if (args == 4) {
                textureArray.push(parseFloat(data[1]), parseFloat(data[2]));
            } else {
                console.error("corrupted texture coord at line:" + line);
                //throw error and end program
                return;
            }
            break;
        case 'f':
            if (args < 4) {
                console.error("corrupted face at line:" + line);
                //throw error and end program
                return;
            }

            //split up the position, normal, and texture coord in the face data
            for (var i = 1; i < args; i++) {
                data[i] = data[i].split('/');
            }

            //turn the face into triangles
            var triangles = []
            for (var i = 2; i < args - 1; i++) {
                triangles.push(data[1], data[i], data[i+1]);
            }

            triangles.forEach(tri => {
                var index = 0;
                if (tri.length == 3) {
                    index = parseFloat(tri[2]) - 1;
                    index = index >= 0 ? index : textureArray.length - index;
                    index *= 4;
                    textureBuffer.push(textureArray[index], textureArray[index + 1]);
                }
                if (tri.length >= 2) {
                    if (tri[1].length == 0) {
                        normalBuffer.push(normalArray[0], normalArray[1], normalArray[2]);
                    } else {
                        index = parseFloat(tri[1]) - 1;
                        index = index >= 0 ? index : normalArray.length - index;
                        index *= 4;
                        normalBuffer.push(normalArray[index], normalArray[index + 1], normalArray[index + 2]);
                    }
                }
                index = parseFloat(tri[0]) - 1;
                index = index >= 0 ? index : vertexArray.length - index;
                index *= 4;
                vertexBuffer.push(vertexArray[index], vertexArray[index + 1], vertexArray[index + 2], vertexArray[index + 3]);
                indexBuffer.push((vertexBuffer.length / 4) - 1);
            });
            break;
        default:
            break;
    }
}

export {ImportOBJ, indexBuffer, vertexBuffer, textureBuffer}