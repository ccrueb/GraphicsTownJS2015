var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Skybox;


// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";
    var m4 = twgl.m4;
    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var camera = m4.identity();
    var view = m4.identity();
    var viewDirection = m4.identity();
    var viewDirectionProjection = m4.identity();
    var viewDirectionProjectionInverse = m4.identity();
    var program;
    var plane;
    var uniforms;

    // constructor for Cubes
    Skybox = function Skybox(name) {
      this.name = name;
    }
    Skybox.prototype.init = function(drawingState) {
      console.log("here");
        var gl=drawingState.gl;
        program = twgl.createProgramInfo(gl, ["skybox-vs", "skybox-fs"]);
        plane = twgl.primitives.createCubeBufferInfo(gl,100);
        console.log(plane)

    // Shared values
    
    uniforms = {
        u_skybox: twgl.createTexture(gl, {
            target: gl.TEXTURE_CUBE_MAP,
            src: [
                'Skybox/textures/posx.jpg',
                'Skybox/textures/negx.jpg',
                'Skybox/textures/posy.jpg',
                'Skybox/textures/negy.jpg',
                'Skybox/textures/posz.jpg',
                'Skybox/textures/negz.jpg',
            ],
        }),
        u_viewDirectionProjectionInverse: viewDirectionProjectionInverse,
    };
  
    };
    Skybox.prototype.draw = function(drawingState) {
      var gl = drawingState.gl;
      var orbitSpeed = 1;
      var radius = 20;
      var projection = m4.perspective(90 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.5, 100);
      var eye = [Math.cos(orbitSpeed) * radius, 4, Math.sin(orbitSpeed) * radius];
      var target = [0, 0, 0];
      var up = [0, 1, 0];

      
      m4.setTranslation(drawingState.view, [0, 0, 0], viewDirection);
      m4.multiply(drawingState.proj, viewDirection, viewDirectionProjection);
      m4.inverse(viewDirectionProjection, viewDirectionProjectionInverse);
      
      uniforms.P = drawingState.proj;
      uniforms.V = drawingState.view;
      uniforms.u_viewDirectionProjectionInverse = viewDirectionProjectionInverse;

      gl.useProgram(program.program);
      twgl.setBuffersAndAttributes(gl, program, plane);
      twgl.setUniforms(program, uniforms);
      twgl.drawBufferInfo(gl, plane);
        
    };
    Skybox.prototype.center = function(drawingState) {
        return this.position;
    }
})();

grobjects.push(new Skybox("Skybox"));