var kanvas;
var ctx;
let pCount = 20;

function changeSize() {
	if (window.innerWidth > 800) {
		if (fullScreenMode) {
			resizeCanvas(window.innerWidth, window.innerHeight, true);
			p5canvas.canvas.style.width = window.innerWidth + "px";
			p5canvas.canvas.style.height = window.innerHeight + "px";
		}
		else {
			resizeCanvas(500, 500, true);
			p5canvas.canvas.style.width = Math.min(window.innerWidth * 0.8, 500) + "px";
			p5canvas.canvas.style.height = Math.min(window.innerWidth * 0.8, 500) + "px";
		}

	}
	else {
		resizeCanvas(500, 500, true);
		p5canvas.canvas.style.width = "500px";
		p5canvas.canvas.style.height = "500px";
	}
}
window.addEventListener('resize', changeSize);

const timeBetFrames = 1;
var Allballs = {};
var Allsegs = {};

var slider = [];
var values = [];
var fullScreenMode = false;
var p5canvas
let gravity = 0.08;
function setup() {
	p5canvas = createCanvas(10, 10);
	p5canvas.parent("p5canv");
	for (var s = 0; s < 3; s++) {
		var slidername = 'slider' + s
		var valuename = 'value' + s
		slider[s] = document.getElementById(slidername);
		values[s] = document.getElementById(valuename);
	}
	changeSize();

	//create Balls
	for (let i = 0; i < pCount; i++) {
		let r = Math.random() * 5 + 5;
		Allballs[i] = new ballClass(
			Math.random() * p5canvas.width, //xposition
			Math.random() * p5canvas.height, //yposition
			(Math.random() - 0.5) * 2, //xspeed or velocity
			(Math.random() - 0.5) * 2, //vypeed
			r,
			r * 50,
			i
		);
	}

	//Create Line Segments
	for (let i = 0; i < 5; i++) {
		Allsegs[i] = new segmentClass(
			Math.random() * p5canvas.width, //xposition
			Math.random() * p5canvas.height, //startY
			Math.random() * p5canvas.width, //xposition
			Math.random() * p5canvas.height,//endY
			5,
			i
		);
	}
	kanvas = document.querySelector('canvas');
	ctx = kanvas.getContext('2d');
}

let selectedBall = -1;
let selectedSeg = -1;
let selectedStart = false;

let userAction = null;

function draw() {
	background(bgColor);
	SettingSliders();
	mode1();
	updateFrameRate();
	updateBallCount();
}

var bgColor = "#000";
function changeBg(element) {
	var getBgColor = element.style.backgroundColor;
	bgColor = getBgColor;
}

var pColor = "#eee";
function changeColors(element) {
	var getColor = element.style.backgroundColor;
	if (element.id == "color0" || element.id == "color1") {
		document.body.style.color = getColor;
	}
	pColor = getColor;
}

var cColor = "rgba(0, 100, 255,"
function changeConColors(element) {
	var str = element.style.backgroundColor;
	str = str.slice(0, 3) + 'a' + str.slice(3);
	cColor = str.substring(0, str.length - 1) + ',';
}

function SettingSliders() {
	for (var s = 0; s < slider.length; s++) {
		if (values[s].innerHTML != slider[s].value) {
			values[s].innerHTML = slider[s].value;
			if (s == 0) {
				gravity = parseFloat(slider[0].value);
			}
			if (s == 1) {
				for (const segId in Allsegs) {
					let seg = Allsegs[segId];
					seg.r = parseInt(slider[1].value);
				}
			}
			if (s == 2) {
				bounciness = parseFloat(slider[2].value);
			}
		}
	}
}
let userMadeCounter = 0;
function mode1() {
	const mouseOverCanvas = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
	if (mouseIsPressed) {
		if (editMode === 'addBall') {
			if (mouseOverCanvas) {
				if (!userAction) {
					userMadeCounter++;
					const newId = `user${userMadeCounter}`;
					userAction = 'addingBall';
					Allballs[newId] = new ballClass(
						mouseX, //xposition
						mouseY, //yposition
						0, //xspeed or velocity
						0, //vypeed
						0,
						0,
						newId
					)
				}
				else {
					const newId = `user${userMadeCounter}`;
					Allballs[newId].v.x = 0;
					Allballs[newId].v.y = 0;
					Allballs[newId].r = constrain(distance(Allballs[newId].p.x, Allballs[newId].p.y, mouseX, mouseY), 0, 50);
					Allballs[newId].mass = Allballs[newId].r * 50;
				}
			}
		}
		if (editMode === 'addSeg') {
			if (mouseOverCanvas) {
				if (!userAction) {
					userMadeCounter++;
					const newId = `seg${userMadeCounter}`;
					userAction = 'addingSeg';
					Allsegs[newId] = new segmentClass(
						mouseX, //xposition
						mouseY, //yposition
						mouseX, //xspeed or velocity
						mouseY, //vypeed
						5,
						newId
					)
				}
				else {
					const newId = `seg${userMadeCounter}`;
					Allsegs[newId].e.x = mouseX;
					Allsegs[newId].e.y = mouseY;
				}
			}
		}
	}
	else {
		userAction = null;
		if (selectedBall != -1) {
			if (selectMode == 'vel') {
				Allballs[selectedBall].v.x = 0.05 * (Allballs[selectedBall].p.x - mouseX);
				Allballs[selectedBall].v.y = 0.05 * (Allballs[selectedBall].p.y - mouseY);
			}
			selectedBall = -1;
		}
		selectedSeg = -1;
	}


	var collisions = [];
	var fakeBalls = [];

	let nSimUdate = 4;
	const simElapsedTime = timeBetFrames / nSimUdate;

	let maxSimSteps = 15;

	// main simulation loop
	for (let i = 0; i < nSimUdate; i++) {
		for (const ballId in Allballs) {
			const ball = Allballs[ballId];
			if (isNaN(ball.p.x) || isNaN(ball.p.y) || Math.abs(ball.a.x) > 99999 || Math.abs(ball.a.y) > 99999) {
				delete Allballs[ballId];
			}
			ball.simTimeRemaining = simElapsedTime;
		}

		for (let j = 0; j < maxSimSteps; j++) {
			//updating positions
			for (const ballId in Allballs) {
				const ball = Allballs[ballId];

				if (ball.simTimeRemaining > 0) {
					ball.o.x = ball.p.x;
					ball.o.y = ball.p.y;

					ball.a.x = -ball.v.x * 0.01;
					ball.a.y = -ball.v.y * 0.01 + gravity;
					ball.v.x += ball.a.x * ball.simTimeRemaining;
					ball.v.y += ball.a.y * ball.simTimeRemaining;
					ball.p.x += ball.v.x * ball.simTimeRemaining;
					ball.p.y += ball.v.y * ball.simTimeRemaining;

					if (bounceEdge) {
						if (ball.p.x < ball.r) {
							ball.p.x = ball.r;
							ball.v.x *= -1;
						}
						if (ball.p.x > width - ball.r) {
							ball.p.x = width - ball.r;
							ball.v.x *= -1;
						}
						if (ball.p.y < ball.r) {
							ball.p.y = ball.r;
							ball.v.y *= -1;
						}
						if (ball.p.y > height - ball.r) {
							ball.p.y = height - ball.r;
							ball.v.y *= -1;
						}
					}
					else {
						if (ball.p.x < -ball.r) {
							ball.p.x = width + ball.r;
						}
						if (ball.p.x > width + ball.r) {
							ball.p.x = -ball.r;
						}
						if (ball.p.y < -ball.r) {
							ball.p.y = height + ball.r;
						}
						if (ball.p.y > height + ball.r) {
							ball.p.y = -ball.r;
						}
					}
				}
			};


			// checking all collisions
			for (const ballId in Allballs) {
				const ball = Allballs[ballId];
				//checking collisions with edges
				for (const segId in Allsegs) {
					let edge = Allsegs[segId];
					let LineX1 = edge.e.x - edge.s.x;
					let LineY1 = edge.e.y - edge.s.y;

					let LineX2 = ball.p.x - edge.s.x;
					let LineY2 = ball.p.y - edge.s.y;

					let EdgeLength = LineX1 * LineX1 + LineY1 * LineY1

					let t = Math.max(0, Math.min(EdgeLength, (LineX1 * LineX2 + LineY1 * LineY2))) / EdgeLength;

					let closestPointX = edge.s.x + t * LineX1;
					let closestPointY = edge.s.y + t * LineY1;

					let d = Math.sqrt((ball.p.x - closestPointX) * (ball.p.x - closestPointX) + (ball.p.y - closestPointY) * (ball.p.y - closestPointY));

					if (d <= (ball.r + edge.r)) {
						var fakeball = new ballClass(
							closestPointX,
							closestPointY,
							-ball.v.x,
							-ball.v.y,
							edge.r,
							ball.mass * 0.8,
							fakeBalls.length
						);
						fakeBalls.push(fakeball);
						collisions.push({
							b1: ball.id,
							b2: fakeball.id,
							fake: true
						});

						let Overlap = (d - ball.r - fakeball.r);
						ball.p.x -= Overlap * (ball.p.x - fakeball.p.x) / d;
						ball.p.y -= Overlap * (ball.p.y - fakeball.p.y) / d;
					}
				};


				//checking collisions with other balls
				for (const targetId in Allballs) {
					const target = Allballs[targetId];
					if (ball.id != target.id) {
						if (DoCirclesOverlap(ball.p.x, ball.p.y, target.p.x, target.p.y, ball.r, target.r)) {
							let DistBetween = distance(ball.p.x, ball.p.y, target.p.x, target.p.y);
							let Overlap = (DistBetween - ball.r - target.r) / 2;
							ball.p.x -= Overlap * (ball.p.x - target.p.x) / DistBetween;
							ball.p.y -= Overlap * (ball.p.y - target.p.y) / DistBetween;
							target.p.x += Overlap * (ball.p.x - target.p.x) / DistBetween;
							target.p.y += Overlap * (ball.p.y - target.p.y) / DistBetween;

							collisions.push({
								b1: ball.id,
								b2: target.id,
								fake: false
							})
						}
					}
				};

				let ballSpeed = Math.sqrt(ball.v.x * ball.v.x + ball.v.y * ball.v.y);
				let actualDistance = Math.sqrt((ball.p.x - ball.o.x) * (ball.p.x - ball.o.x) + (ball.p.y - ball.o.y) * (ball.p.y - ball.o.y));
				let actualTime = actualDistance / ballSpeed;
				ball.simTimeRemaining = ball.simTimeRemaining - actualTime;
			};

			//dealing with collisions
			collisions.forEach(c => {
				var b1 = Allballs[c.b1];
				var b2 = Allballs[c.b2];
				if (c.fake) {
					b2 = fakeBalls[c.b2];
				}

				let d = distance(b1.p.x, b1.p.y, b2.p.x, b2.p.y);
				let nx = ((b2.p.x - b1.p.x) / d);
				let ny = ((b2.p.y - b1.p.y) / d);

				let tx = -ny;
				let ty = nx;

				let dpTan1 = b1.v.x * tx + b1.v.y * ty;
				let dpTan2 = b2.v.x * tx + b2.v.y * ty;

				let dpNorm1 = b1.v.x * nx + b1.v.y * ny;
				let dpNorm2 = b2.v.x * nx + b2.v.y * ny;

				let m1 = bounciness * (dpNorm1 * (b1.mass - b2.mass) + 2 * b2.mass * dpNorm2) / (b1.mass + b2.mass);
				let m2 = (dpNorm2 * (b2.mass - b1.mass) + 2 * b1.mass * dpNorm1) / (b1.mass + b2.mass);

				Allballs[c.b1].v.x = tx * dpTan1 + nx * m1;
				Allballs[c.b1].v.y = ty * dpTan1 + ny * m1;

				if (c.fake) {
					fakeBalls[c.b2].v.x = tx * dpTan2 + nx * m2;
					fakeBalls[c.b2].v.y = ty * dpTan2 + ny * m2;
				}
				else {
					Allballs[c.b2].v.x = tx * dpTan2 + nx * m2;
					Allballs[c.b2].v.y = ty * dpTan2 + ny * m2;
				}
			});

			collisions = [];
			fakeBalls = [];
		}
	}


	for (const ballId in Allballs) {
		const ball = Allballs[ballId];
		ball.display();
	};
	for (const segId in Allsegs) {
		const seg = Allsegs[segId];
		seg.display();
	};
	if (selectedBall != -1) {
		stroke("blue");
		strokeWeight(5);
		line(Allballs[selectedBall].p.x, Allballs[selectedBall].p.y, mouseX, mouseY);
	}
}

class ballClass {
	constructor(positionX, positionY, velocityX, velocityY, radius, mass, id) {
		this.p = createVector(positionX, positionY);
		this.o = createVector(positionX, positionY);
		this.v = createVector(velocityX, velocityY);
		this.a = createVector(0, 0);
		this.id = id;
		this.r = radius;
		this.mass = mass;
		this.simTimeRemaining = 0;
	}

	display() {
		noStroke();
		if ((editMode == 'edit' || editMode == 'remove') && (selectedBall == this.id || distance(this.p.x, this.p.y, mouseX, mouseY) <= this.r)) {
			strokeWeight(5);
			stroke(3, 144, 252);
		}
		if (mouseIsPressed) {
			if (distance(this.p.x, this.p.y, mouseX, mouseY) <= this.r) {
				if (editMode === 'remove') {
					delete Allballs[this.id];
				}
			}
			if (editMode === 'edit') {
				if (selectedBall == -1 && !userAction) {
					if (distance(this.p.x, this.p.y, mouseX, mouseY) <= this.r) {
						selectedBall = this.id;
						userAction = 'ball selected';
					}
				}
				else {
					if (selectedBall == this.id) {
						if (selectMode == 'pos') {
							this.p.x = mouseX;
							this.p.y = mouseY;
						}
					}
				}
			}
		}
		fill(pColor);
		ellipse(this.p.x, this.p.y, this.r * 2);
	}
}


class segmentClass {
	constructor(startX, startY, endX, endY, radius, id) {
		this.s = {
			x: startX,
			y: startY
		};
		this.e = {
			x: endX,
			y: endY
		};;
		this.id = id;
		this.r = radius;
	}

	display() {
		if (this.mouseOverSeg()) {
			if (mouseIsPressed) {
				if (editMode === 'remove') {
					delete Allsegs[this.id];
				}
			}
			strokeWeight(this.r * 2 + 2);
			stroke(3, 144, 252);
		}

		if (mouseIsPressed) {
			if (editMode === 'edit') {
				if (selectedSeg == -1) {
					if (!userAction) {
						if (distance(this.s.x, this.s.y, mouseX, mouseY) <= this.r) {
							userAction = 'segment selected';
							selectedSeg = this.id;
							selectedStart = true;
						}
						if (distance(this.e.x, this.e.y, mouseX, mouseY) <= this.r) {
							userAction = 'segment selected';
							selectedSeg = this.id;
							selectedStart = false;
						}
					}
				}
				else {
					if (selectedSeg == this.id) {
						strokeWeight(this.r * 2 + 2);
						stroke(255);
						if (selectedStart) {
							this.s.x = mouseX;
							this.s.y = mouseY;
						}
						else {
							this.e.x = mouseX;
							this.e.y = mouseY;
						}
					}
				}
			}
		}
		line(this.s.x, this.s.y, this.e.x, this.e.y);

		stroke(cColor + '0.5)');
		strokeWeight(this.r * 2);
		line(this.s.x, this.s.y, this.e.x, this.e.y);
		noStroke();
		fill(cColor + '1)');
		ellipse(this.s.x, this.s.y, this.r * 2);
		ellipse(this.e.x, this.e.y, this.r * 2);
	}

	mouseOverSeg() {
		const lineLength = distance(this.s.x, this.s.y, this.e.x, this.e.y); // Calculate the length of the line segment

		// Calculate distances from the mouse to both endpoints
		const d1 = distance(mouseX, mouseY, this.s.x, this.s.y);
		const d2 = distance(mouseX, mouseY, this.e.x, this.e.y);

		// Check if the mouse is within the line segment's bounding box
		if (d1 + d2 <= lineLength + this.r && d1 < lineLength && d2 < lineLength) {
			// Calculate the perpendicular distance from the mouse to the line
			const numerator = abs(
				(this.e.x - this.s.x) * (this.s.y - mouseY) - (this.s.x - mouseX) * (this.e.y - this.s.y)
			);
			const denominator = distance(this.s.x, this.s.y, this.e.x, this.e.y);
			const d = numerator / denominator;
			return d < this.r;
		}
		return (distance(this.s.x, this.s.y, mouseX, mouseY) < this.r || distance(this.e.x, this.e.y, mouseX, mouseY) < this.r);
	}
}


function DoCirclesOverlap(x1, y1, x2, y2, r1, r2) {
	return distance(x1, y1, x2, y2) <= r1 + r2;
}

function distance(x, y, x1, y1) {
	return Math.sqrt(((x1 - x) * (x1 - x)) + ((y1 - y) * (y1 - y)));
}

function mod(n, m) {
	return ((n % m) + m) % m;
}


document.getElementById("fullScreen").addEventListener("change", (e) => {
	if (e.currentTarget.checked) {
		fullScreenMode = true;
		changeSize();
		frElement.style.position = "absolute";
		frElement.style.left = "10px";
		frElement.style.top = "10px";
		//			document.getElementById("cont").style.left = "0px";
		document.getElementById("cont").style.top = "0px";
		//			document.getElementById("cont").style.transform = "none";
		document.getElementById("cont").style.transform = "translate(-50%,0)";
		for (const ballId in Allballs) {
			const ball = Allballs[ballId];
			ball.p.x += (window.innerWidth / 2) - (500 / 2);
			ball.p.y += (window.innerHeight / 2) - (500 / 2);
		}
		for (const segId in Allsegs) {
			const seg = Allsegs[segId];
			seg.s.x += (window.innerWidth / 2) - (500 / 2);
			seg.e.x += (window.innerWidth / 2) - (500 / 2);
			seg.s.y += (window.innerHeight / 2) - (500 / 2);
			seg.e.y += (window.innerHeight / 2) - (500 / 2);
		}
	}
	else {
		for (const ballId in Allballs) {
			const ball = Allballs[ballId];
			ball.p.x -= (window.innerWidth / 2) - (500 / 2);
			ball.p.y -= (window.innerHeight / 2) - (500 / 2);
		}
		for (const segId in Allsegs) {
			const seg = Allsegs[segId];
			seg.s.x -= (window.innerWidth / 2) - (500 / 2);
			seg.e.x -= (window.innerWidth / 2) - (500 / 2);
			seg.s.y -= (window.innerHeight / 2) - (500 / 2);
			seg.e.y -= (window.innerHeight / 2) - (500 / 2);
		}
		fullScreenMode = false;
		document.getElementById("cont").style.top = "50%";
		document.getElementById("cont").style.transform = "translate(-50%,-250px)";
		frElement.style.position = "relative";
		frElement.style.left = "0";
		frElement.style.top = "0";
		resizeCanvas(500, 500, false);
	}
});

var bounceEdge = false;
document.getElementById("bounceEdge").addEventListener("change", (e) => {
	bounceEdge = e.currentTarget.checked
});


const frElement = document.getElementById("frameRateDisplay");
function updateFrameRate() {
	frElement.innerHTML = Math.round(frameRate());
}

const ballCount = document.getElementById("ballCount");
function updateBallCount() {
	ballCount.innerHTML = Object.keys(Allballs).length;
}

let editMode = 'edit'
const selectModeDiv = document.getElementById('select-mode-div');
function changeMode(mode) {
	if (mode == 'edit') {
		selectModeDiv.style.display = 'flex';
	}
	else {
		selectModeDiv.style.display = 'none';
	}
	editMode = mode;
}

var mode = 'add';
const addBall = document.getElementById("add-ball");
const addSeg = document.getElementById("add-segment");
const removeObj = document.getElementById("remove-objects");
const removeAllButton = document.getElementById("change-all");
removeObj.style.display = "none";
removeAllButton.style.display = "none";
function changeNumberMode(numberMode) {
	document.getElementById("edit-mode").checked = true;
	editMode = 'edit';
	if (numberMode == "add") {
		addBall.style.display = "block";
		addSeg.style.display = "block";
		removeObj.style.display = "none";
		removeAllButton.style.display = "none";
	}
	else {
		addBall.style.display = "none";
		addSeg.style.display = "none";
		removeObj.style.display = "block";
		removeAllButton.style.display = "inline-block";
	}
	mode = numberMode;
}


var selectMode = 'vel';
const selectModeLabel = document.getElementById("select-mode-label");
selectModeLabel.innerHTML = "velocity";

document.getElementById("select-mode").addEventListener("change", (e) => {
	if (e.currentTarget.checked) {
		selectModeLabel.innerHTML = "velocity";
		selectMode = 'vel';
	}
	else {
		selectModeLabel.innerHTML = "position";
		selectMode = 'pos';
	}
});

function changeNumberOfBalls(number) {
	const numberOfBalls = number;
	if (mode === 'add') {
		for (let i = 0; i < numberOfBalls; i++) {
			let r = Math.random() * 5 + 5;
			const newId = `random${userMadeCounter}`;
			Allballs[newId] = new ballClass(
				Math.random() * p5canvas.width, //xposition
				Math.random() * p5canvas.height, //yposition
				(Math.random() - 0.5) * 2, //xspeed or velocity
				(Math.random() - 0.5) * 2, //vypeed
				r,
				r * 50,
				newId
			);
			userMadeCounter++;
		}
	}
	else {
		for (let i = 0; i < numberOfBalls; i++) {
			const id = Object.keys(Allballs)[0];
			delete Allballs[id];
		}
	}
};

function removeAll() {
	Allballs = {};
}

document.getElementById("controls-sw").addEventListener("change", (e) => {
	if (e.currentTarget.checked) {
		document.getElementById("slider-cont").style.transform = "translate(0,0)";
		document.getElementById("controls-cont").style.transform = "translate(0,0)";
	}
	else {
		document.getElementById("slider-cont").style.transform = "translateX(400px)";
		document.getElementById("controls-cont").style.transform = "translateX(-400px)";
	}
});