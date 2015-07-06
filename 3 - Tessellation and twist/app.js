

var canvas;
var gl;

var points = [];
var theta = 0.0;
var thetaLoc;

var NumTimesToSubdivide = 6;
var thetaLoc;

var slTheta;
var txtSubdivisions;

var compileShaders = function(gl){
    var vs = document.getElementById( "vertex-shader" );
    var fs = document.getElementById( "fragment-shader" );

    var getShader = function (source, type, typeString){
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
            alert ("Error en "+typeString+ " Shader : " + gl.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    }

    /* COMPILE */
    var vertexShader = getShader(vs.text, gl.VERTEX_SHADER, "VERTEX");
    var fragmentShader = getShader(fs.text, gl.FRAGMENT_SHADER, "FRAGMENT");
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    /* LINK */
    gl.linkProgram(shaderProgram);
    
    return shaderProgram;
    
}

var vec2 = function()
{
    var result = [].concat.apply( [], Array.prototype.slice.apply(arguments) );

    switch ( result.length ) {
    case 0: result.push( 0.0 );
    case 1: result.push( 0.0 );
    }

    return result.splice( 0, 2 );
}

var flatten = function ( v )
{

    var n = v.length;
    var elemsAreArrays = false;

    if ( Array.isArray(v[0]) ) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array( n );

    if ( elemsAreArrays ) {
        var idx = 0;
        for ( var i = 0; i < v.length; ++i ) {
            for ( var j = 0; j < v[i].length; ++j ) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for ( var i = 0; i < v.length; ++i ) {
            floats[i] = v[i];
        }
    }

    return floats;
}

var mix = function( u, v, s )
{
    if ( typeof s !== "number" ) {
        throw "mix: the last paramter " + s + " must be a number";
    }

    if ( u.length != v.length ) {
        throw "vector dimension mismatch";
    }

    var result = [];
    for ( var i = 0; i < u.length; ++i ) {
        result.push( (1.0 - s) * u[i] + s * v[i] );
    }

    return result;
}

window.onload = function init()
{
    points = [];
    canvas = document.getElementById( "gl-canvas" );

    try{
        gl = canvas.getContext("experimental-webgl");
    }catch(e){
        alert("WebGL no es compatible");
        return false;
    }

    //DOC: https://en.wikipedia.org/wiki/Sierpinski_triangle

    var vertices = [
        vec2( -0.7, -0.7 ),
        vec2(  0,  0.7 ),
        vec2(  0.7, -0.7 )
    ];

    slTheta = document.getElementById("slTheta");
    txtSubdivisions = document.getElementById("txtSubdivisions");

    slTheta.addEventListener("input", function(){
        theta = slTheta.value;
    });

    txtSubdivisions.addEventListener("input", function(){
        NumTimesToSubdivide = txtSubdivisions.value;
        init();
    });

    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    var shaderProgram = compileShaders(gl);
    gl.useProgram( shaderProgram );


    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( shaderProgram, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(shaderProgram, "theta");

    render();
};

function triangle( a, b, c )
{
    points.push( a, b, c );
}

function divideTriangle( a, b, c, count )
{

    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    //theta += 0.005;
    gl.uniform1f(thetaLoc, theta)
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    window.requestAnimationFrame(render);
}
