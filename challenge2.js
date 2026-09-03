const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    alert("WebGL not supported");
}

// Vertex Shader
const vsSource = `
attribute vec2 aPosition;
uniform mat3 uMatrix;

void main() {
    vec3 pos = uMatrix * vec3(aPosition, 1.0);
    gl_Position = vec4(pos.xy, 0.0, 1.0);
}
`;

// Fragment Shader
const fsSource = `
precision mediump float;
uniform vec4 uColor;

void main() {
    gl_FragColor = uColor;
}
`;

function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

const vertexShader = compileShader(gl.VERTEX_SHADER, vsSource);
const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fsSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const vertices = new Float32Array([
    -0.5, -0.5,
     0.5, -0.5,
    -0.5,  0.5,

    -0.5,  0.5,
     0.5, -0.5,
     0.5,  0.5
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, "aPosition");

gl.vertexAttribPointer(
    aPosition,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.enableVertexAttribArray(aPosition);

const uColor = gl.getUniformLocation(program, "uColor");
const uMatrix = gl.getUniformLocation(program, "uMatrix");

function matrix(tx, ty, sx, sy, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return new Float32Array([
        sx * c,  sx * s, 0,
       -sy * s, sy * c, 0,
        tx,      ty,    1
    ]);
}

function drawPart(tx, ty, sx, sy, angle, color) {
    gl.uniformMatrix3fv(
        uMatrix,
        false,
        matrix(tx, ty, sx, sy, angle)
    );

    gl.uniform4fv(uColor, color);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

const ovalVertices = new Float32Array(2 + 2 * 33);
ovalVertices[0] = 0;
ovalVertices[1] = 0;
for (let i = 0; i <= 32; i++) {
    const angle = (i / 32) * Math.PI * 2;
    ovalVertices[2 + i * 2] = Math.cos(angle) * 0.5;
    ovalVertices[3 + i * 2] = Math.sin(angle) * 0.5;
}

const ovalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, ovalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, ovalVertices, gl.STATIC_DRAW);

function drawOval(tx, ty, sx, sy, color) {
    gl.bindBuffer(gl.ARRAY_BUFFER, ovalBuffer);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix3fv(uMatrix, false, matrix(tx, ty, sx, sy, 0));
    gl.uniform4fv(uColor, color);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 34);
}

gl.clearColor(1, 1, 1, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

// BODY
drawPart(
    0.0, -0.1,
    0.46, 0.38,
    0,
    [6, 0.6, 0.7, 1]
);

// HEAD (scaled larger)
drawPart(
    0.0, 0.27,
    0.28, 0.5,
    0,
    [0.5, 0.75, 0.75, 1]
);

// LEFT ARM
drawPart(
    -0.32, -0.08,
    0.10, 0.32,
    -Math.PI/7,
    [0.4, 0.2, 0.2, 1]
);

// RIGHT ARM (rotated)
drawPart(
    0.32, 0.0,
    0.10, 0.32,
    Math.PI / 4,
    [0.4, 0.2, 0.2, 1]
);

// LEFT LEG
drawPart(
    -0.14, -0.43,
    0.15, 0.28,
    0,
    [0.15, 0.15, 0.15, 1]
);

// RIGHT LEG
drawPart(
    0.14, -0.43,
    0.15, 0.28,
    0,
    [0.15, 0.15, 0.15, 1]
);

// LEFT EYE
drawPart(
    -0.08, 0.29,
    0.1, 0.07,
    0,
    [1, 0, 0, 1]
);

// RIGHT EYE
drawPart(
    0.08, 0.29,
    0.1, 0.07,
    0,
    [1, 0, 0, 1]
);

// LEFT ANTENNA
drawPart(
    -0.08, 0.47,
    0.025, 0.16,
    -Math.PI / 180,
    [0.2, 0.2, 0.2, 1]
);

// RIGHT ANTENNA
drawPart(
    0.08, 0.47,
    0.025, 0.16,
    Math.PI / 180,
    [0.2, 0.2, 0.2, 1]
);


// ANTENNA TOP
drawPart(
    0.0, 0.555,
    0.06, 0.16,
    0,
    [1, 0, 1, 1]
);

// Mouth
drawPart(
    0.0, 0.1,
    0.16, 0.06,
    0,
    [1, 0, 0, 1]
);

// DASHED SPEECH BUBBLE CONNECTOR
drawPart(
    0.168, 0.307,
    0.045, 0.012,
    Math.PI / 6,
    [0.9, 0.9, 0.9, 1]
);

drawPart(
    0.244, 0.361,
    0.045, 0.012,
    Math.PI / 6,
    [0.9, 0.9, 0.9, 1]
);

drawPart(0.32, 0.415, 0.045, 0.012, Math.PI / 6, [0.9, 0.9, 0.9, 1]);
drawPart(0.396, 0.469, 0.045, 0.012, Math.PI / 6, [0.9, 0.9, 0.9, 1]);
drawPart(0.472, 0.523, 0.045, 0.012, Math.PI / 6, [0.9, 0.9, 0.9, 1]);

// SPEECH BUBBLE
drawOval(
    0.65, 0.55,
    0.28, 0.15,
    [0.9, 0.9, 0.9, 1]
);
