var playerPosition=[0,0];
var playerVelocity=[0,0];

var cpuPosition=[0,0];
var cpuVelocity=[0,0];

var playPosition=[0,0];
var playVelocity=[0,0];

var mouseX=0;
var mouseY=0;

var x=0;
var y=0;

document.onmousemove=function(event) {
	mouseX=event.clientX;
	mouseY=event.clientY;
};

function min(a,b) {
	if (a<b) {
		return a;
	}
	return b;
}

function drawGoal(canvas,x) {
	var context=canvas.getContext("2d");
	context.fillStyle="#FF0000";
	context.fillRect(x,canvas.height/2-canvas.height*OPENING_RATIO/2,20,canvas.height*OPENING_RATIO);
}

function cancelCollisions() {
	if (playPosition[0]<0 || playPosition[0]>canvas.width) {
		
	}
}

function loop() {

	var context=canvas.getContext("2d");

	context.clearRect(playerPosition[0]-105,playerPosition[1]-105,210,210);

	playerPosition[0]=mouseX-64;
	playerPosition[1]=mouseY-64;

	drawGoal(canvas,0);
	drawGoal(canvas,canvas.width-20);

	context.beginPath();
	context.arc(playerPosition[0],playerPosition[1],50,0,2*Math.PI,false);
	context.fillStyle="#000000";
	context.fill();
	context.stroke();
}

var canvas=document.createElement("canvas");
canvas.height=min(window.innerHeight-100,window.innerWidth-100/ASPECT_RATIO);
canvas.width=canvas.height*ASPECT_RATIO;
canvas.style.zIndex=0;
canvas.style.position="absolute";
canvas.style.border=WALL_WIDTH+"px solid";
document.body.appendChild(canvas);

setInterval(loop,4);