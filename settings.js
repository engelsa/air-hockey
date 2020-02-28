var WALL_WIDTH=1;
var ASPECT_RATIO=2;
var OPENING_RATIO=.4;

var gameObjects=[];
var mousePosition=[0,0];

function createObject(size,isPlayer,x,y,limitedRight) {
	var object=new Object();
	object.size=size;
	object.velocity=[0,0];
	object.position=[0,0];

	if (isPlayer) {
		object.score=0;
		object.targetPosition=[x,y];
		object.limit=limitedRight;
	}

	gameObjects.push(object);

	return object;
}

function getDifferenceVector(from,to) {
	var distance=[0,0];
	distance[0]=to[0]-from[0];
	distance[1]=to[1]-from[1];
	return distance;
}

function recordMousePosition(event) {
	player1.targetPosition[0]=event.pageX;
	player1.targetPosition[1]=event.pageY;
}

function magnitude(vector) {
	return Math.pow(Math.pow(vector[0],2)+Math.pow(vector[1],2),.5);
}

function min(a,b) {
	if (a<b) {
		return a;
	}
	return b;
}

function max(a,b) {
	if (a>b) {
		return a;
	}
	return b;
}

function getUnitVector(vector) {
	var vectorMagnitude=magnitude(vector);
	var unitVector=[0,0];
	if (vectorMagnitude>0) {
		unitVector[0]=vector[0]/vectorMagnitude;
		unitVector[1]=vector[1]/vectorMagnitude;
	}
	return unitVector;
}

function goal(score) {

	puck.position[0]=canvas.width/2;
	puck.position[1]=canvas.height/2;
	puck.velocity[0]=0;
	puck.velocity[1]=0;
	player1.position[0]=canvas.width*.9;
	player1.position[1]=canvas.height/2;
	player2.position[0]=canvas.width*.1;
	player2.position[1]=canvas.height/2;

	if (score==1) {
		player1.score++;
	} else if (score==2) {
		player2.score++;
	}

	var score=document.getElementById("score");
	score.innerHTML=player2.score+"-"+player1.score;
}

var canvas=document.createElement("canvas");
canvas.height=min(window.innerHeight-50,window.innerWidth-20/ASPECT_RATIO);
canvas.width=canvas.height*ASPECT_RATIO;
canvas.style.zIndex=0;
canvas.style.position="absolute";
document.body.appendChild(canvas);

var player1=createObject(150,true,canvas.width/2,canvas.height/2,false);
var player2=createObject(150,true,canvas.width/2,canvas.height/2,true);
var puck=createObject(75,false);

function cancelCollisions() {
	if (puck.position[0]<puck.size/2 && puck.velocity[0]<0) {
		puck.position[1]=puck.position[1]+puck.velocity[1]*(puck.size/2-puck.position[0])/puck.velocity[0];
		puck.position[0]=puck.size/2;
		puck.velocity[0]=puck.velocity[0]*-.8;
		puck.velocity[1]=puck.velocity[1]*.8;
		if (puck.position[1]>(canvas.height/2)-canvas.height*OPENING_RATIO/2 && puck.position[1]<(canvas.height/2)+canvas.height*OPENING_RATIO/2) {
			goal(1);
		}
	}
	if (puck.position[0]>canvas.width-puck.size/2 && puck.velocity[0]>0) {
		puck.position[1]=puck.position[1]+puck.velocity[1]*(puck.position[0]-canvas.width+puck.size/2)/puck.velocity[0];
		puck.position[0]=canvas.width-puck.size/2;
		puck.velocity[0]=puck.velocity[0]*-.8;
		puck.velocity[1]=puck.velocity[1]*.8;
		if (puck.position[1]>(canvas.height/2)-canvas.height*OPENING_RATIO/2 && puck.position[1]<(canvas.height/2)+canvas.height*OPENING_RATIO/2) {
			goal(2);
		}
	}
	if (puck.position[1]<puck.size/2 && puck.velocity[1]<0) {
		puck.position[0]=puck.position[0]+puck.velocity[0]*(puck.size/2-puck.position[1])/puck.velocity[1];
		puck.position[1]=puck.size/2;
		puck.velocity[0]=puck.velocity[0]*.8;
		puck.velocity[1]=puck.velocity[1]*-.8;
	}
	if (puck.position[1]>canvas.height-puck.size/2 && puck.velocity[1]>0) {
		puck.position[0]=puck.position[0]+puck.velocity[0]*(puck.position[1]-canvas.height+puck.size/2)/puck.velocity[1];
		puck.position[1]=canvas.height-puck.size/2;
		puck.velocity[0]=puck.velocity[0]*.8;
		puck.velocity[1]=puck.velocity[1]*-.8;
	}
	for (var index=0;index<gameObjects.length;index++) {
		if (gameObjects[index]!=puck) {
			gameObjects[index].position[0]=min(max(gameObjects[index].size/2,gameObjects[index].position[0]),canvas.width-gameObjects[index].size/2);
			gameObjects[index].position[1]=min(max(gameObjects[index].size/2,gameObjects[index].position[1]),canvas.height-gameObjects[index].size/2);
			if (gameObjects[index].limit) {
				gameObjects[index].position[0]=min(gameObjects[index].position[0],canvas.width/2);
			} else {
				gameObjects[index].position[0]=max(gameObjects[index].position[0],canvas.width/2);
			}
			var distance=getDifferenceVector(puck.position,gameObjects[index].position);
			var distanceUnit=getUnitVector(distance);
			var velocity=getDifferenceVector(puck.velocity,gameObjects[index].velocity);
			if (magnitude(distance)<(gameObjects[index].size+puck.size)/2) { //ADD SMART CHECK??
				var tangentLine=Math.atan2(distance[1],distance[0])+Math.PI;
				var entryAngle=Math.atan2(velocity[1],velocity[0]);
				var newAngle=tangentLine-(entryAngle-tangentLine);
				var newSpeed=magnitude(velocity);
				puck.velocity[0]=newSpeed*Math.cos(newAngle);
				puck.velocity[1]=newSpeed*Math.sin(newAngle);
				puck.position[0]=gameObjects[index].position[0]-distanceUnit[0]*((gameObjects[index].size+puck.size)/2+1);
				puck.position[1]=gameObjects[index].position[1]-distanceUnit[1]*((gameObjects[index].size+puck.size)/2+1);
			}
		}
	}
}

function calculatePosition() {
	for (var index=0;index<gameObjects.length;index++) {
		gameObjects[index].position[0]=gameObjects[index].position[0]+gameObjects[index].velocity[0]*.0001;
		gameObjects[index].position[1]=gameObjects[index].position[1]+gameObjects[index].velocity[1]*.0001;
	}
}

function calculatePlayerVelocity() {
	for (var index=0;index<gameObjects.length;index++) {
		if (gameObjects[index]!=puck) {
			var movementVector=[gameObjects[index].targetPosition[0]-10-gameObjects[index].position[0],gameObjects[index].targetPosition[1]-60-gameObjects[index].position[1]];
			var unitVector=getUnitVector(movementVector);
			var movementMagnitude=min(magnitude(movementVector),10);
			gameObjects[index].velocity[0]=unitVector[0]*movementMagnitude;
			gameObjects[index].velocity[1]=unitVector[1]*movementMagnitude;
		}
	}
}

function clearCanvas(context) {
	for (var index=0;index<gameObjects.length;index++) {
		context.beginPath();
		context.rect(max(0,gameObjects[index].position[0]-gameObjects[index].size/2-1),max(0,gameObjects[index].position[1]-gameObjects[index].size/2-1),max(gameObjects[index].position[1]+gameObjects[index].size/2+1,0),max(gameObjects[index].position[1]+gameObjects[index].size/2+1,0));
		context.fillStyle="white";
		context.fill();
	}
}

function drawObjects(context) {
	for (var index=0;index<gameObjects.length;index++) {
		context.beginPath();
		context.arc(gameObjects[index].position[0],gameObjects[index].position[1],gameObjects[index].size/2-1,0,2*Math.PI);
		context.fillStyle="#000000";
		context.fill();
		context.stroke();
	}
}

function drawGoal(x,context) {
	context.fillStyle="#FF0000";
	context.fillRect(x,canvas.height/2-canvas.height*OPENING_RATIO/2,20,canvas.height*OPENING_RATIO);
}

function simulateComputer() {
	if (puck.position[0]<canvas.width/2+(player2.size+puck.size)/2) {
		if (puck.velocity[0]<-2) {
			player2.targetPosition[0]=puck.position[0]-player2.size-puck.size;
		} else {
			player2.targetPosition[0]=puck.position[0];
		}
	} else {
		player2.targetPosition[0]=0;
	}
	player2.targetPosition[1]=puck.position[1];
	player2.targetPosition[0]=max(player2.targetPosition[0],10);
}

function loop() {
	var context=canvas.getContext("2d");

	clearCanvas(context);

	for (var delta=0;delta<1;delta+=.0001) {
		calculatePosition();
		cancelCollisions();
	}

	simulateComputer();
	calculatePlayerVelocity();

	drawGoal(0,context);
	drawGoal(canvas.width-20,context);
	drawObjects(context);
}

goal(0);
var context=canvas.getContext("2d");
context.beginPath();
context.rect(0,0,canvas.width,canvas.height);
context.fillStyle="white";
context.fill();
setInterval(loop,1);
canvas.addEventListener("mousemove",recordMousePosition);