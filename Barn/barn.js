//Chicken
var grobjects = grobjects || [];

var Barn;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";
    var shaderProgram = undefined;
    var baseBuffers;
    var roofBuffers;
    var woodTexture;

    // constructor for Cubes
    Barn = function Barn(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.6,.2,.1]

    }
    Barn.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["barn-vs", "barn-fs"]);
        }
        //
        baseBuffers = twgl.primitives.createCubeBufferInfo(gl,this.size);
        console.log(baseBuffers);
        woodTexture = twgl.createTexture(gl, { src: "Barn/textures/wood.jpg"})
        
    };
    Barn.prototype.draw = function(drawingState) {
        var gl = drawingState.gl;
      
        var modelM = twgl.m4.identity();
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl, shaderProgram, baseBuffers);
        
        twgl.setUniforms(shaderProgram, {
            u_woodTexture: woodTexture,
            
            view:drawingState.view, 
            proj:drawingState.proj,
            model:modelM, 
            lightdir:drawingState.sunDirection,
            cubecolor:this.color});
        
        twgl.drawBufferInfo(gl, baseBuffers);
        
        

    };
    Barn.prototype.center = function(drawingState) {
        return this.position;
    }

})();
grobjects.push(new Barn("Barn1",[-2,1,   0],5) );