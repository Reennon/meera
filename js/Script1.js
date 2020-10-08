// JavaScript source code
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


var Anim = { //animation settings
    'duration': 3000,
    'interval' : 10,
    'stepUnit' : 1.0,
    'currUnit' : 0.0
}

function Gradient(context, width, height){
    this.ctx = context;
    this.width = width;
    this.height = height;
    this.colorStops = [];
    this.currentStop = 0;
}

Gradient.prototype.addStop = function(pos, colors){
    var stop = {'pos': pos, 'colors':colors, 'currColor': null}
    this.colorStops.push(stop)
}

Gradient.prototype.updateStops = function(){ //interpolate colors of stops
    var steps = Anim.duration / Anim.interval,
    		step_u = Anim.stepUnit/steps
    		stopsLength = this.colorStops[0].colors.length - 1;

    for(var i = 0; i < this.colorStops.length; i++){ //cycle through all stops in gradient
        var stop = this.colorStops[i],
        		startColor = stop.colors[this.currentStop],//get stop 1 color
        		endColor, r, g, b;

				if(this.currentStop < stopsLength){ //get stop 2 color, go to first if at last stop
					endColor = stop.colors[this.currentStop + 1];
				} else {
					endColor = stop.colors[0];
				}
        
        //interpolate both stop 1&2 colors to get new color based on animaiton unit
        r = Math.floor(lerp(startColor.r, endColor.r, Anim.currUnit));
        g = Math.floor(lerp(startColor.g, endColor.g, Anim.currUnit));
        b = Math.floor(lerp(startColor.b, endColor.b, Anim.currUnit));

        stop.currColor = 'rgb('+r+','+g+','+b+')';
    }

    // update current stop and animation units if interpolaiton is complete
   	if (Anim.currUnit >= 1.0){
   		Anim.currUnit = 0;
   		if(this.currentStop < stopsLength){
   			this.currentStop++;
   		} else {
   			this.currentStop = 0;
   		}
   	}

   	Anim.currUnit += step_u; //increment animation unit
}

Gradient.prototype.draw = function(){
		var gradient = ctx.createLinearGradient(0,this.width,this.height,0);

    for(var i = 0; i < this.colorStops.length; i++){
        var stop = this.colorStops[i],
        		pos = stop.pos,
            color = stop.currColor;

        gradient.addColorStop(pos,color);
    }

    this.ctx.clearRect(0,0,this.width,this.height);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0,0,this.width,this.height);
}

var $width, $height, gradient,
		canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
    stopAColor = [
        { 'r':'109', 'g':'106', 'b':'92' }, //light brown
        { 'r': '107', 'g': '81', 'b':'81' }, //orange
        { 'r': '68', 'g':'66', 'b':'1' }, //yellow
        { 'r': '117', 'g': '117', 'b':'117' } //red
    ],
    stopBColor = [
        { 'r': '11', 'g': '10', 'b':'7' }, //light brown
        { 'r': '10', 'g':'10', 'b':'25' }, //orange
        { 'r':'7', 'g':'2', 'b':'2' }, //red
        { 'r': '20', 'g':'20', 'b':'9' } //yellow
    ];

var updateUI = function(){
		$width = $(window).width(),
		$height = $(window).height();

		canvas.width = $width;
		canvas.height = $height;

		gradient = new Gradient(ctx, canvas.width, canvas.height);
		gradient.addStop(0, stopAColor);
		gradient.addStop(1, stopBColor);
}

$(function(){

	  updateUI();

	  $(window).resize(function(){
		  updateUI();
	  });

	  (function animloop(){
	    requestAnimFrame(animloop);
	    gradient.updateStops();
	    gradient.draw();
	  })();

});

//interpolation
function lerp(a, b, u) {
    return (1 - u) * a + u * b;
}
