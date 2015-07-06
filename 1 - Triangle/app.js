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

var main = function(){
	var canvas = document.getElementById("web-gl-container");

	/* GET WEBGL CONTEXT */

	var gl;
	try{
		gl = canvas.getContext("experimental-webgl");
	}catch(e){
		alert("WebGL no es compatible");
		return false;
	}

	/* SHADERS */
	var shaderProgram = compileShaders(gl);
	

	var _position = gl.getAttribLocation(shaderProgram, "vPosition");
	gl.enableVertexAttribArray(_position);

	gl.useProgram(shaderProgram);

	/* Triangle Vertex */
	var vertex=[
		-1,-1,
		0,1,
		1,-1
	];

	var triangleBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

	/* INDEX BUFFER */
	var index = [0,1,2];
	var indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);

	/* PAINT */
	gl.clearColor(0.0, 0.0, 0.0, 0.0);

	var animate = function(){
		gl.viewport(0.0, 0.0, canvas.width, canvas.height);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
		gl.vertexAttribPointer("_position", 2, gl.FLOAT, false, 4*2, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

		gl.flush();
		window.requestAnimationFrame(animate);
	}
	animate();


};