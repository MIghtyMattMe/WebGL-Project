let vertexArray;
let normalArray;
let textureArray;
let vertexBuffer;
let normalBuffer;
let textureBuffer;

async function ImportOBJ(filelocation, status) {
    status.imported = false;
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
    console.log(vertexArray);
    console.log(vertexBuffer);
    status.imported = true;
}

function readData(data, line) {
    var args = data.length;
    switch (data[0]){
        case 'v':
            if (args < 4 || args > 5) {
                console.error("corrupted vertex at line:" + line);
                //throw error and end program
                return;
            }
            vertexArray.push(parseFloat(data[1]));
            vertexArray.push(parseFloat(data[2]));
            vertexArray.push(parseFloat(data[3]));
            //check for optional w component and fill in if missing
            if (args == 5) {
                vertexArray.push(parseFloat(data[4]));
            } else {
                vertexArray.push(1.0);
            }
            break;
        case 'f':
            if (args < 4) {
                console.error("corrupted face at line:" + line);
                //throw error and end program
                return;
            }

            //split up the vertex, normal, and texture coord in the face data
            for (var i = 1; i < args; i++) {
                data[i] = data[i].split('/');
            }

            //add values to the buffers but in an order so that each face is a series of triangles
            for (var i = 2; i < args - 1; i++) {
                if (data[1].length == 1) {
                    textureBuffer.push(0,0,0);
                    normalBuffer.push(0,0,0);
                } else if (data[1].length == 2) {
                    textureBuffer.push(data[1][1]-1, data[i][1]-1, data[i+1][1]-1);
                    normalBuffer.push(0,0,0);
                } else if (data[1].length == 3) {
                    textureBuffer.push(data[1][1]-1, data[i][1]-1, data[i+1][1]-1);
                    normalBuffer.push(data[1][2]-1, data[i][2]-1, data[i+1][2]-1);
                }
                vertexBuffer.push(data[1][0]-1, data[i][0]-1, data[i+1][0]-1);
            }
            break;
        default:
            break;
    }
}

export {ImportOBJ, vertexArray, vertexBuffer}