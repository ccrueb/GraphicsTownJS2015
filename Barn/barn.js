//Chicken
var grobjects = grobjects || [];

var Barn;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";
    var shaderProgram = undefined;
    var roof;
    var baseBuffers;
    var roofBuffers;
    var woodTexture;
    var uwTexture;

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
            roof = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        //
        baseBuffers = twgl.primitives.createCubeBufferInfo(gl,this.size);
        woodTexture = twgl.createTexture(gl, { src: "Barn/textures/wood.jpg"})
        uwTexture = twgl.createTexture(gl, { src: "Barn/textures/uw.png"})
        
        //Roof
        var arrays = {
                vpos : { numComponents: 3, data: [
                    
                    -this.size/2,-this.size/2,-this.size/2,  this.size/2,-this.size/2,-this.size/2,  this.size/2,-this.size/2, this.size/2,        -this.size/2,-this.size/2,-this.size/2,  this.size/2,-this.size/2, this.size/2, -this.size/2,-this.size/2, this.size/2,    // y = 0
                    -this.size/2, -this.size/2,-this.size/2,  this.size/2, -this.size/2,-this.size/2,  0, this.size/2,0,
                     this.size/2, -this.size/2,-this.size/2,  this.size/2, -this.size/2, this.size/2,  0, this.size/2,0,  
                     this.size/2, -this.size/2, this.size/2,  -this.size/2, -this.size/2, this.size/2,  0, this.size/2,0,  
                    -this.size/2, -this.size/2, this.size/2,  -this.size/2, -this.size/2,-this.size/2,  0, this.size/2,0,  
                      
                ] },
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                ]}
        }
            
            roofBuffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
            
        
    };
    Barn.prototype.draw = function(drawingState) {
        var gl = drawingState.gl;
      
        var modelM = twgl.m4.identity();
        twgl.m4.setTranslation(modelM,this.position, modelM)
        twgl.m4.translate(modelM, [0, this.size/2,0], modelM)
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl, shaderProgram, baseBuffers);
        
        twgl.setUniforms(shaderProgram, {
            u_woodTexture: woodTexture,
            u_uwTexture: uwTexture,
            view:drawingState.view, 
            proj:drawingState.proj,
            model:modelM, 
            lightdir:drawingState.sunDirection,
            cubecolor:this.color});
        
        twgl.drawBufferInfo(gl, baseBuffers);
        
        //Roof
        modelM = twgl.m4.identity();
        twgl.m4.setTranslation(modelM,this.position, modelM)
        twgl.m4.translate(modelM, [0, this.size*1.5,0], modelM)
        gl.useProgram(roof.program);
        twgl.setBuffersAndAttributes(gl, roof, roofBuffers);
        twgl.setUniforms(roof,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:[this.size/2,.2,.2], model: modelM });
        twgl.drawBufferInfo(gl, roofBuffers);

    };
    Barn.prototype.center = function(drawingState) {
        return this.position;
    }

})();
grobjects.push(new Barn("Barn1",[3,0,   -3],4) );