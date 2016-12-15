//Chicken
var grobjects = grobjects || [];

var Chicken = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";
    var shaderProgram = undefined;
    var buffers = undefined;
    var texture;
    var feetBuffers = undefined;

    // constructor for Cubes
    Chicken = function Chicken(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
    }
    Chicken.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["chicken-vs", "chicken-fs"]);
        }
        //Square component
        if (!buffers) {
            var arrays = {
      vpos: { numComponents: 3, data: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1], },
      vnormal:  { numComponents: 3, data:  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1], },
      vtex: { numComponents: 2, data: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1], },
      indices:  [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
    };
    buffers = twgl.createBufferInfoFromArrays(gl,arrays);
            
            
        var feetarrays = {
                vpos : {numcomponents:3, data: [0,0,-.4, 0,1,-.4, 0,0,-.2,
                                                0,0,-.2, 0,1,-.2, 0,1,-.4,
                                                0,0,.4, 0,1,.4, 0,0,.2,
                                                0,0,.2, 0,1,.2, 0,1,.4]},
                vnormal : {numcomponents:3, data: [0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0,0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0]},
                vtex: { numComponents: 2, data: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1], },
                indices : [0,1,2, 3,4,5,6,7,8,9,10,11]
            };
      feetBuffers = twgl.createBufferInfoFromArrays(drawingState.gl,feetarrays);
    }

    if(!texture) {
        texture = twgl.createTexture(gl, {
      src: "./Chicken/textures/chicken.jpg",
      crossOrigin: "", 
    });
    }

        

    };
    Chicken.prototype.draw = function(drawingState) {
        
        jump(this, drawingState)
        //Body
        var modelM = twgl.m4.scaling([this.size*.9  ,this.size *.8,this.size * .8]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM, texSampler: texture });
        twgl.drawBufferInfo(gl, buffers, gl.TRIANGLES);
        
   
        //Wings
        var modelM = twgl.m4.scaling([this.size * .6,this.size *.4,this.size * .95]);
        twgl.m4.setTranslation(modelM,[this.position[0], this.position[1], this.position[2]],modelM);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM, texSampler: texture });
        twgl.drawBufferInfo(gl, buffers, gl.TRIANGLES);
        
        //Head
        var modelM = twgl.m4.scaling([this.size * .5,this.size *.6,this.size * .5]);
        twgl.m4.setTranslation(modelM,[this.position[0] + .35, this.position[1] +1, this.position[2]],modelM);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM, texSampler: texture });
        twgl.drawBufferInfo(gl, buffers, gl.TRIANGLES);
        
        //Feet
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,[this.position[0], this.position[1]-1, this.position[2]],modelM);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM, texSampler: texture });
        twgl.setBuffersAndAttributes(gl,shaderProgram,feetBuffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, feetBuffers)
    };
    Chicken.prototype.center = function(drawingState) {
        return this.position;
    }
    
    function jump(chicken, drawingState) {
       
        if (!chicken.lastTime) {
            chicken.lastTime = drawingState.realtime;
            return;
        }
        var delta = drawingState.realtime - chicken.lastTime;
        chicken.lastTime = drawingState.realtime;
        
        chicken.position[1] += (Math.sin(chicken.lastTime* .005)/100) 
    }

})();
//grobjects.push(new Chicken("Chicken1",[-2,1,   0],1) );