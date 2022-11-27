//swup stuff
const swup = new Swup({
	plugins: [
		//		new SwupHeadPlugin({persistTags: (tag) => tag.id == "main-style"}), 
		//						new SwupHeadPlugin(), 
		new SwupPreloadPlugin(),
		//						new SwupProgressPlugin(),
		new SwupDebugPlugin()
	]
});
var transitionIsFinished = false;
document.addEventListener('swup:transitionEnd', (event) => {
	//	turnOffLoader();
	transitionIsFinished = true;
});
document.addEventListener('swup:animationOutDone', (event) => {
	//	location.reload();
	turnOnLoader();
});
window.addEventListener('load', (event) => {
	transitionIsFinished = true;
});

//var loader;
//function createLoader(){
//	loader = document.createElement('div');
//	document.getElementById('swup').appendChild(loader);
//	loader.classList.add('loader-circle');
//	loader.setAttribute("id", 'loader-circle');
//}
const loader = document.getElementById('loader-circle');
const loaderP = document.querySelector('#loader p');
const loaderImg = document.querySelector('#loader img');
var LoaderIsOn;
function turnOffLoader() {
	LoaderIsOn = false;
	//	console.log('loaderOff');
	loaderP.style.opacity = 0;
	loaderImg.style.opacity = 0;
	loader.style.left = Math.random() * 90 + 5 + "vw";
	loader.style.top = Math.random() * 90 + 5 + "vh";
	loader.style.transition = 'all 2s ease';
	loader.style.width = '300vmax';
	loader.style.height = '300vmax';
	loader.style.pointerEvents = 'none';
}
turnOnLoader();
function turnOnLoader() {
	transitionIsFinished = false;
	LoaderIsOn = true;
	//	console.log('loaderON');
	loaderP.style.opacity = 1;
	loaderImg.style.opacity = 1;
	loader.style.transition = 'none';
	loader.style.width = '0vmax';
	loader.style.height = '0vmax';
	loader.style.pointerEvents = 'auto';
}

//menu stuff
{
	var menu = document.getElementById('menu');
	var menuDiv = document.getElementById('menuDiv');
	var open = false;
	var touchX;
	var touchY;

	function openMenu() {
		//	if(screen.width>600 && screen.height>600){
		if (screen.width > 600 && screen.height > 600 && pageWidth > 600 && pageHeight > 600) {
			if (open) {
				if (mouseX > window.innerWidth / 6) {
					menu.style.transform = "rotate(2deg) translate(-90%,-5%)";
					menuDiv.style.opacity = "0";
					open = false;
				}
				else {

				}
			}
			else {
				if (mouseX < window.innerWidth / 15) {
					menu.style.transform = "rotate(5deg) translate(-30%,-5%)";
					menuDiv.style.opacity = "1";
					open = true;
				}
				else {
					menu.style.transform = "rotate(2deg) translate(-90%,-5%)";
					menuDiv.style.opacity = "0";
				}
			}
		}
		else {
			if (docClicked) {
				if (menuClicked) {
					menu.style.transform = "rotate(5deg) translate(-30%,-5%)";
					menuDiv.style.opacity = "1";
					menu.style.top = "-30vh";
					menuDiv.style.pointerEvents = "auto";
					open = true;
				}
				else {
					menu.style.transform = "translate(-200%,-20%) rotate(45deg)";
					menu.style.top = "-10vh";
					menuDiv.style.opacity = "0";
					open = false;
				}
				docClicked = false;
				menuClicked = false;
			}
		}
	}
	var menuClicked = false;
	menu.addEventListener("touchstart", e => {
		menuClicked = true;
	});
	menu.addEventListener("mouseover", e => {
		menuClicked = true;
	});
	var docClicked = false;
	document.addEventListener("mouseover", e => {
		docClicked = true;
	});
	document.addEventListener("touchstart", e => {
		docClicked = true;
	});
}



//vars for all pages
{
	var scrollYPos = 0;
	var scrollX = 0;
	var scrollY = 0;

	var pageHeight = window.innerHeight;
	var pageWidth = window.innerWidth;

	var pageContent = document.getElementById('pageContent');
	var blobsEl = document.getElementById('blobs');

	var currentPage = 1;
	var scrollPage = 1;

	var m = {
		x: 0,
		y: 0
	}
	var pm = {
		x: 0,
		y: 0
	}
}
var stylesLoaded = false;
var elements = {}
var globeIsLoaded = false;

//classes and objects

//flower
var dandelion = [];
class flower {
	constructor(baseX, baseY, flowerLength, flowerAngle, flowerSize, color) {
		this.noiseLevel = 10;
		this.color = color;
		this.awayFromScreen = true;

		this.base = {
			x: baseX,
			y: baseY
		};
		this.flowerpos = {
			x: flowerLength * Math.cos(flowerAngle) + baseX,
			y: flowerLength * Math.sin(flowerAngle) + baseX
		};
		this.flowerLength = flowerLength;
		this.restAngle = flowerAngle;
		this.flowerA = 0;
		this.flowerAs = 0;

		this.trueX = [];
		this.trueY = [];
		this.trueL = [];

		this.seedX = [];
		this.seedY = [];
		this.seedA = [];
		this.seedXs = [];
		this.seedYs = [];
		var s = flowerSize;
		var L = 0;
		for (var l = 0.001; l < s; l += 10) {
			L++;
			for (var a = 0; a < (Math.PI * 2); a += (Math.PI * 2) / (l / 1.5)) {
				// for(var a = 0; a<(Math.PI*2); a+= 15){
				var d = l / Math.pow(L, 0.6) * 3;
				this.trueX.push(Math.sin(a) * d);
				this.trueY.push(Math.cos(a) * d);
				this.trueL.push(L);
				this.seedX.push(this.trueX[this.trueX.length - 1] + this.flowerpos.x);
				this.seedY.push(this.trueY[this.trueY.length - 1] + this.flowerpos.y);
				this.seedA.push(a);
				this.seedXs.push(0);
				this.seedYs.push(0);
			}
		}
	}

	calc() {
		this.flowerpos.x = this.flowerLength * Math.cos(this.flowerA) + this.base.x;
		this.flowerpos.y = this.flowerLength * Math.sin(this.flowerA) + this.base.y;
		if (doIntersect(this.flowerpos, this.base, m, pm)) {
			if (this.flowerA < 0) {
				this.flowerAs += radians((m.x - pm.x) / 50);
			}
			else {
				this.flowerAs -= radians((m.x - pm.x) / 50);
			}
		}
		this.flowerAs += ((this.restAngle - this.flowerA) / 50 - this.flowerAs) / 50;
		this.flowerA += this.flowerAs;
	}
	display() {
		strokeWeight(5);
		stroke(this.color, 100);
		noFill();
		bezier(this.base.x, this.base.y, this.base.x, this.base.y, this.base.x, ((this.base.y - this.flowerpos.y) / 2) + this.flowerpos.y, this.flowerpos.x, this.flowerpos.y);
		noStroke();
		fill(200);
		ellipse(this.flowerpos.x, this.flowerpos.y, 30);

		for (var i = 0; i < this.trueL.length; i++) {
			if (mouseIsPressed || this.awayFromScreen) {
				this.seedX[i] += ((this.trueX[i] + this.flowerpos.x) - this.seedX[i]) / 10;
				this.seedY[i] += ((this.trueY[i] + this.flowerpos.y) - this.seedY[i]) / 10;
				this.seedXs[i] = 0;
				this.seedYs[i] = 0;
			}
			if (distance(this.seedX[i], this.seedY[i], this.flowerpos.x, this.flowerpos.y) < 120) {
				this.seedXs[i] = ((this.trueX[i] + this.flowerpos.x) - this.seedX[i]) / (this.trueL[i]);
				this.seedYs[i] = ((this.trueY[i] + this.flowerpos.y) - this.seedY[i]) / (this.trueL[i]);
				this.seedA[i] = Math.atan2(this.seedY[i] - this.flowerpos.y, this.seedX[i] - this.flowerpos.x);
			}
			else {
				this.seedXs[i] *= 0.99;
				this.seedYs[i] *= 0.99;
			}
			this.seedXs[i] += 0.2;
			this.seedYs[i] += -0.1;
			this.seedX[i] += this.seedXs[i];
			this.seedY[i] += this.seedYs[i];

			if (!this.awayFromScreen) {
				var noiseX = (noise(this.trueL[i], i) - 0.5) * this.noiseLevel;
				var noiseY = (noise(i, this.trueL[i]) - 0.5) * this.noiseLevel;
				drawSeed(this.seedX[i] + noiseX, this.seedY[i] + noiseY, 10, this.seedA[i] + (noise(i, this.trueL[i]) - 0.5) * 10, this.color);
			}
		}
	}
}
function drawSeed(x, y, s, a, c) {
	stroke(c, 100);
	strokeWeight(5);
	point(x, y);
	//		 strokeWeight(1);
	//		 stroke(c,105);
	//		 push();
	//		 translate(x,y);
	//		 rotate(a);
	//		 line(0,0,s*1.5,0);
	//		 line(s*1.5,0,s*2,s);
	//		 line(s*1.5,0,s*2,-s);
	//		 line(s*1.5,0,s*2,-s/2);
	//		 line(s*1.5,0,s*2,s/2);
	//		 pop();
}


//koi
var allFish = [];
var speed = 2;
var shift = [0, 0];
class koi {
	constructor(x, y, body, mouse) {
		this.id = 0;
		this.bL = body;
		this.m = mouse;
		this.bx = [x];
		this.by = [y];
		this.tx = [0];
		this.ty = [0];
		for (var i = 1; i < body; i++) {
			this.bx.push(0);
			this.by.push(0);
			this.tx.push(0);
			this.ty.push(0);
		}
		this.speed = speed;
		this.angle = random(0, (Math.PI * 2));
		this.ma = 0;
		this.off = 0;
		this.show = false;
	}
	move(id) {
		if (this.bL > this.bx.length) {
			//				for(var i = 0; i<this.bL-this.bx.length; i++){
			this.bx.push(0);
			this.by.push(0);
			this.tx.push(0);
			this.ty.push(0);
			//				}
		}
		this.id = id;
		this.speed += (speed - this.speed) / 10;
		//				ellipse(this.m.x, this.m.y, 10, 10);


		var diff = distance(this.m.x - shift[0], this.m.y - shift[1], this.bx[0], this.by[0]);

		var angle = getAngle(this.bx[0], this.by[0], this.m.x - shift[0], this.m.y - shift[1]);
		this.ma = angle - this.angle;
		this.ma = mod(this.ma + Math.PI, (Math.PI * 2)) - Math.PI;

		this.angle -= (0 - this.ma) / (this.bL * 2);

		this.bx[0] += this.speed * Math.cos(this.angle);
		this.by[0] += this.speed * Math.sin(this.angle);


		for (var i = 1; i < this.bL; i++) {
			//				var off = 9*Math.sin(radians(this.off));
			var a = getAngle(this.bx[i], this.by[i], this.bx[i - 1], this.by[i - 1]);
			var a1 = getAngle(this.bx[i - 1], this.by[i - 1], this.bx[i - 2], this.by[i - 2]);


			this.bx[i] = this.bx[i - 1] - Math.cos(a) * (this.bL - i) / 3;
			this.by[i] = this.by[i - 1] - Math.sin(a) * (this.bL - i) / 3;
		}
		//			this.off+=50/this.bL;



		//			if((this.bx[0]+shift[0])<(width+20) && (this.bx[0]+shift[0])>-20 && (this.by[0]+shift[1])<(height+20) && (this.by[0]+shift[1])>-20)
		{
			this.show = true;
		}
		//			else{
		//				this.show = false;
		//			}
	}

	display(color) {
		noStroke();
		if (this.show) {
			var bL = Math.floor(this.bL) - 1;

			drawBody(this.bx, this.by, bL, color);
			var s = this.bL / 1.9;
			var a = this.angle;
			var third = Math.floor(bL);
			drawHead(this.bx[0], this.by[0], s, a);
			a = getAngle(this.bx[third], this.by[third], this.bx[third - 1], this.by[third - 1]);
			drawFin(this.bx[third], this.by[third], s * 1.3, a);
			//				a = getAngle(this.bx[bL], this.by[bL],this.bx[bL - 1], this.by[bL - 1]);

			//drawTail(this.bx[bL], this.by[bL], s, a);


			//the other tail method
			this.tx[0] = this.bx[bL];
			this.ty[0] = this.by[bL];

			for (var i = 1; i < bL; i++) {
				var angle = getAngle(this.tx[i], this.ty[i], this.tx[i - 1], this.ty[i - 1]);
				this.tx[i] = this.tx[i - 1] - Math.cos(angle) * 2;
				this.ty[i] = this.ty[i - 1] - Math.sin(angle) * 2;
				ellipse(this.tx[i] + shift[0], this.ty[i] + shift[1], 2);
			}
			speed = 1.5;
		}
	}
}

function drawBody(x, y, bL, color) {
	var s = bL;
	for (var i = 0; i < bL; i++) {
		if (i > Math.floor(bL / 4)) {
			s -= 1;
		}
		fill(color);
		ellipse(x[i] + shift[0], y[i] + shift[1], s);
	}
}
function drawHead(x, y, s, a) {
	push();
	translate(x + shift[0], y + shift[1]);
	rotate(a);
	beginShape();
	curveVertex(0, s * 1);
	curveVertex(0, s * -0.75);
	curveVertex(s * 1.3, s * -0.5);
	curveVertex(s * 1.7, 0);
	curveVertex(s * 1.3, s * 0.5);
	curveVertex(0, s * 0.75);
	curveVertex(0, s * -1);
	endShape();
	fill(255);
	stroke(255);
	strokeWeight(1);
	ellipse(s * 1.1, s * 0.5, s / 9);
	ellipse(s * 1.1, s * -0.5, s / 9);
	pop();
}
function drawFin(x, y, s, a) {
	push();
	translate(x + shift[0], y + shift[1]);
	rotate(a);
	beginShape();
	curveVertex(0, 0);
	curveVertex(s * -1.5, s * 1.5);
	curveVertex(s * -1.5, s * 0.5);
	curveVertex(0, 0);
	curveVertex(s * -1.5, s * -0.5);
	curveVertex(s * -1.5, s * -1.5);
	curveVertex(0, 0);
	endShape(CLOSE);
	pop();
}
function drawTail(x, y, s, a) {
	push();
	translate(x + shift[0], y + shift[1]);
	rotate(a);
	beginShape();
	curveVertex(0, 0);
	curveVertex(s * -2, s);
	curveVertex(s * -4, s * 0.5);
	curveVertex(s * -1.5, 0);
	curveVertex(s * -5, s * -0.2);
	curveVertex(s * -2, s * -1);
	curveVertex(0, 0);
	endShape(CLOSE);
	pop();
}

function getAngle(x, y, mx, my) {
	var dx = mx - x;
	var dy = my - y;
	var angle = Math.atan2(dy, dx);
	return angle;
}



//goop
var AllGoops = [];
function createGoop(x, y, size, color) {
	AllGoops.push(new goop(width * x, height * y, size, color, AllGoops.length));
}

class liqParticle {
	constructor(angle, liqheight, globalx, globaly, id, globalID) {
		this.a = angle;
		this.h = liqheight;
		this.hs = 0;
		this.gx = globalx;
		this.gy = globaly;
		this.gID = globalID;
		this.id = id;
		this.gl = this.h;
		this.x = 0;
		this.y = 0;
	}
	move() {
		this.h += this.hs;
		this.hs *= 0.9;

		var l = this.gl;
		var r = this.gl;
		if (this.id < 1) {
			l = AllGoops[this.gID].LP[AllGoops[this.gID].LP.length - 1].h;
		}
		else {
			l = AllGoops[this.gID].LP[this.id - 1].h;
		}
		if (this.id > AllGoops[this.gID].LP.length - 2) {
			r = AllGoops[this.gID].LP[0].h;
		}
		else {
			r = AllGoops[this.gID].LP[this.id + 1].h
		}
		this.hs += ((l + r) / 2 - this.h) / 10;
		this.hs += (this.gl - this.h) / 60;
		this.x = this.h * Math.cos(this.a) + this.gx;
		this.y = this.h * Math.sin(this.a) + this.gy;
		if (distance(this.x, this.y, mouseX, mouseY) < this.gl / 4) {
			this.hs += (distance(this.gx, this.gy, mouseX, mouseY) - this.h) / 10;
		}
	}
}

class goop {
	constructor(x, y, s, color, id) {
		this.x = x;
		this.y = y;
		this.s = s;
		this.color = color;
		this.LP = [];
		this.segLength = radians(20);
		this.id = id;
		for (var i = 0; i < radians(359); i += this.segLength) {
			this.LP[Math.round(i / this.segLength)] = new liqParticle(i, 250, this.x, this.y, Math.round(i / this.segLength), this.id);
		}
	}
	display() {
		fill(this.color);
		//			fill(10,100);
		noStroke();
		beginShape();
		curveVertex(this.LP[this.LP.length - 1].x, this.LP[this.LP.length - 1].y);
		this.LP.forEach(dot => {
			dot.gx = this.x + shift[0];
			dot.gy = this.y + shift[1];
			dot.gl = this.s;
			dot.move();
			curveVertex(dot.x, dot.y);

			for (var i = 0; i < allFish.length; i++) {
				var fishX = allFish[i].bx[0] + shift[0];
				var fishY = allFish[i].by[0] + shift[1];
				var LPX = dot.x;
				var LPY = dot.y;
				if (distance(LPX, LPY, fishX, fishY) < this.s / 5) {
					dot.hs += (distance(this.x + shift[0], this.y + shift[1], fishX, fishY) - dot.h) / 10;
				}
			}
		});
		curveVertex(this.LP[0].x, this.LP[0].y);
		curveVertex(this.LP[1].x, this.LP[1].y);
		endShape();
	}
}






var page;
function init() {
	stylesLoaded = false;
	//	createLoader();
	window.scrollTo(0, 0);
	pageContent = document.getElementById('pageContent');
	blobsEl = document.getElementById('blobs');
	p5canvas.parent('p5canvas');
	scrollYPos = 0;
	scrollX = 0;
	scrollY = 0;

	if (window.location.pathname.endsWith(".html")) {
		page = window.location.pathname.slice(1, -5);
	}
	else {
		page = window.location.pathname.slice(1);
	}
	if (page == '/' || page == "") {
		page = 'index';
	}
	if (page == 'index') {
		dynamicallyLoadStyle('home.css');
		elements.welcomeTitle = document.getElementById('welcome-title');

		dandelion[0] = (new flower(pageWidth, pageWidth, 300, radians(60), 70, 0));
		dandelion[1] = (new flower(pageWidth, pageWidth, 400, radians(-60), 70, 0));
		dandelion[2] = (new flower(pageWidth, pageWidth, 300, radians(-110), 70, 0));
		allFish.length = 3;
		for (var i = 0; i < 3; i++) {
			var randomWidth = Math.random() * width;
			var randomHeight = Math.random() * height;
			var randomSize = Math.random() * 10 + 15;
			var smouse = createVector(randomWidth, randomHeight)
			allFish[i] = new koi(randomWidth, randomHeight, randomSize, smouse);
		}
	}
	if (page == 'aboutme') {
		dynamicallyLoadStyle('aboutme.css');
		if (globeIsLoaded) {
			globeReset();
		}
		else {
			dynamicallyLoadScript('three.min.js')
				.then(m => {
					dynamicallyLoadScript('globe.js').then(globeIsLoaded = true)
				});

		}

		elements.timeline = document.getElementById('timeline');
		elements.timelineTextDiv = document.getElementById('timelineTextDiv');
		elements.timelineText = document.getElementById('timelineText');
		elements.timelineImgDiv = document.getElementById('image-div');
		elements.timelineImages = document.querySelectorAll('.TLimage');
		elements.timelineBlobs = document.getElementById('timelineBlobs');
		elements.negative = document.getElementById('negative');




		allFish.length = 1;
		allFish[0] = new koi(
			Math.random() * width,
			Math.random() * height,
			Math.random() * 10 + 15,
			createVector(randomWidth, randomHeight)
		);
	}
	if (page == 'portfolio') {
		dynamicallyLoadStyle('portfolio.css');

		elements.bgCircleDiv = document.getElementById('bg-circles');
		elements.skillsList = document.querySelectorAll('.skill-list li');
		elements.aboutMeImg = document.getElementById('aboutme-img');
		elements.newCircle = [];
		elements.skillsMouse = [];


		for (var i = 0; i < 40; i++) {
			elements.newCircle[i] = document.createElement("div");
			elements.newCircle[i].classList.add('bg-circle');

			if (i < 20) {
				elements.newCircle[i].style.left = Math.random() * 100 + "vw";
				elements.newCircle[i].style.top = Math.random() * 350 + "vh";
			}
			else {
				elements.newCircle[i].style.left = Math.random() * 100 + 25 + "vw";
				elements.newCircle[i].style.top = Math.random() * 100 + 350 + "vh";
			}
			elements.newCircle[i].style.backgroundColor = colorbank[Math.round(Math.random() * colorbank.length - 1)];


			var randomW = Math.random() * 50;
			elements.newCircle[i].style.width = randomW + "px";
			elements.newCircle[i].style.height = randomW + "px";

			elements.bgCircleDiv.appendChild(elements.newCircle[i]);
		}

		for (var i = 0; i < elements.skillsList.length; i++) {
			elements.skillsMouse.push(false);
			elements.skillsList[i].setAttribute('id', i);

			elements.skillsList[i].addEventListener('mouseover', e => {
				elements.skillsMouse[e.srcElement.id] = true;
			});
			elements.skillsList[i].addEventListener('mouseout', e => {
				elements.skillsMouse[e.srcElement.id] = false;
			});
		}

		document.getElementById('all-projects-here').addEventListener('mouseenter', e => {
			sharpen();
		});
		document.getElementById('all-projects-here').addEventListener('mouseleave', e => {
			rounden();
		});

		alive = true;
		start = true;
		sharp = false;
		currentSkill = 0;
		ySkill = 0;
	}
	if (page == 'projects') {
		dynamicallyLoadStyle('projects.css');

		for (var i = 0; i < pCount; i++) {
			A.x[i] = Math.random() * window.innerWidth;
			A.y[i] = Math.random() * window.innerHeight;
			A.xs[i] = (Math.random() - 0.5) * 20;
			A.ys[i] = (Math.random() - 0.5) * 20;
			A.size[i] = 0;
			A.originalSize[i] = Math.random() * 50 + 50;
			A.color[i] = createVector(Math.random() * 55, Math.random() * (30), Math.random() * (30));;
		}
	}
	if (page == 'contact') {
		dynamicallyLoadStyle('contact.css');

		elements.y = 0;
		contactJS();
	}
}
swup.on('contentReplaced', init);

function unload() {
	elements = {};
	var deleteScripts = document.body.querySelectorAll('script');
	//	deleteScripts.forEach(s=>{
	//		s.remove();
	//	})
	var deleteStyles = document.head.querySelectorAll('link');
	deleteStyles.forEach(s => {
		if (s.rel == 'stylesheet' && !s.href.endsWith('styles.css')) {
			s.remove();
		}
	})
}
swup.on('willReplaceContent', unload);



var p5canvas;
function setup() {
	p5canvas = createCanvas(10, 10);
	p5canvas.parent('p5canvas');
	changeSize();
	//	angleMode(DEGREES);
	angleMode(RADIANS);
	init();
}



function draw() {
	pageHeight = window.innerHeight;
	pageWidth = window.innerWidth;
	//	scrollYPos = window.pageYOffset;
	if (screen.width > 600 && screen.height > 600 && pageWidth > 600 && pageHeight > 600) {
		scrollYPos += (window.pageYOffset - scrollYPos) / 10;
	}
	else {
		scrollYPos = window.pageYOffset;
	}

	currentPage = Math.floor((scrollYPos / pageHeight) + 0.5);
	scrollPage = Math.floor((scrollYPos / pageHeight));

	clear();
	m.x = mouseX;
	m.y = mouseY;
	pm.x = pmouseX;
	pm.y = pmouseY;

	if (page == 'index') {
		indexJS();
	}
	if (page == 'aboutme') {
		aboutmeJS();
	}
	if (page == 'portfolio') {
		portfolioJS();
	}
	if (page == 'projects') {
		projectsJS();
	}
	if (page == 'contact') {
		contactJS();
	}
	if (p5canvas.canvas.style.width != windowWidth + "px" || p5canvas.canvas.style.height != windowHeight + "px") {
		changeSize();
		if (page == 'portfolio') {
			AllGoops.length = 0;
			createGoop(0.7, 2.5, 250, '#906b5e');
			createGoop(0.2, 4.5, 250, '#e6ddd4');
			createGoop(1.2, 5.5, 250, '#b8aa8c');
			createGoop(0.2, 6.5, 250, '#93ae88');
			createGoop(1, 9.5, 600, '#93ae88');
		}
	}
	openMenu();
	if (transitionIsFinished && stylesLoaded && LoaderIsOn) {
		turnOffLoader();
	}
};



function indexJS() {
	if (screen.width > 600 && screen.height > 600 && pageWidth > 600 && pageHeight > 600) {
		var w = pageWidth / 2;
		var h = Math.PI / (pageHeight * 2);
		scrollX = -w * Math.cos(h * scrollYPos) + w;
		scrollY = scrollYPos;


		pageContent.style.left = -scrollX + "px";
		pageContent.style.top = -scrollY + "px";

		if (currentPage > 1) {
			void elements.welcomeTitle.offsetWidth;
			elements.welcomeTitle.classList.add("bounce");
			elements.welcomeTitle.style.transform = "rotate(-30deg)";
		}
		if (scrollPage < 1) {
			elements.welcomeTitle.classList.remove("bounce");
			elements.welcomeTitle.style.transform = "rotate(0deg)";
		}


		shift = [-scrollX / pageWidth * width / 2, -scrollY / pageHeight * height / 2];

		for (var i = 0; i < allFish.length; i++) {
			allFish[i].display(100);
			if (!allFish[i].show) {
				allFish[i].speed = 15;
			}
			allFish[i].move(i);
			if (i == 0) {
				allFish[0].m.x = mouseX;
				allFish[0].m.y = mouseY;
			}
			else {
				allFish[i].m.x = width * noise(frameCount / 200 + i * 25);
				allFish[i].m.y = height * noise(frameCount / 200 + 400 + i * 25);
			}
		}



		strokeWeight(1);
		stroke(255, 0, 0, 100);
		line(mouseX, mouseY, pmouseX, pmouseY);


		if (scrollPage > 0 && scrollPage < 3) {
			dandelion[0].awayFromScreen = false;
		}
		else {
			dandelion[0].awayFromScreen = true;
		}
		dandelion[0].calc();
		dandelion[0].base.x = (p5canvas.width * 1.15) - scrollX / pageWidth * p5canvas.width;
		dandelion[0].base.y = (p5canvas.height * 2) - scrollY / pageHeight * p5canvas.height + 150;
		dandelion[0].display();


		if (scrollPage > 2 && scrollPage < 5) {
			dandelion[1].awayFromScreen = false;
		}
		else {
			dandelion[1].awayFromScreen = true;
		}
		dandelion[1].calc();
		dandelion[1].base.x = (p5canvas.width * 0.5) - scrollX / pageWidth * p5canvas.width;
		dandelion[1].base.y = (p5canvas.height * 4.5) - scrollY / pageHeight * p5canvas.height + 350;
		dandelion[1].display();


		if (scrollPage > 4 && scrollPage < 8) {
			dandelion[2].awayFromScreen = false;
		}
		else {
			dandelion[2].awayFromScreen = true;
		}
		dandelion[2].calc();
		dandelion[2].base.x = (p5canvas.width * 1.25) - scrollX / pageWidth * p5canvas.width;
		dandelion[2].base.y = (p5canvas.height * 7.2) - scrollY / pageHeight * p5canvas.height - 190;
		dandelion[2].display();


		blobsEl.style.top = "0px";
		//		if(scrollPage>0 && menu.style.transform!="rotate(2deg) translate(-90%,-5%)"){
		//			menu.style.transform="rotate(2deg) translate(-90%,-5%)";
		//		}
		openMenu();
	}
	else {
		pageContent.style.left = "0px";
		pageContent.style.top = "0px";
		blobsEl.style.top = -scrollYPos / 2 + "px";
	}
}












var PTLevent = 0;
var TLTwidth = 0;

function skipTL(destination) {
	if (destination == "top") {
		window.scrollTo(0, 0);
	}
	if (destination == "timeline") {
		if (screen.width > 600 && screen.height > 600 && pageWidth > 600 && pageHeight > 600) {
			window.scrollTo(pageWidth, pageHeight * 4);
		}
		else {
			window.scrollTo(0, 1300);
		}
	}
	if (destination == "interests") {
		if (screen.width > 600 && screen.height > 600 && pageWidth > 600 && pageHeight > 600) {
			window.scrollTo(pageWidth, pageHeight * 18);
		}
		else {
			window.scrollTo(0, 2000);
		}
	}
}

function aboutmeJS() {
	pageHeight = window.innerHeight;
	pageWidth = window.innerWidth;
	//	scrollYPos += (window.pageYOffset-scrollYPos)/10;

	currentPage = Math.floor((scrollYPos / pageHeight) + 0.5);
	scrollPage = Math.floor((scrollYPos / pageHeight));

	if (screen.width > 600 && screen.height > 600 && pageWidth > 600 && pageHeight > 600) {
		pageContent.style.left = -scrollX + "px";
		pageContent.style.top = -scrollY + "px";


		clear();
		noStroke();

		shift = [-scrollX / pageWidth * width / 2, -scrollY / pageHeight * height / 2];

		allFish.length = 1;
		allFish[0].display(100);
		if (!allFish[0].show) {
			allFish[0].speed = 15;
		}
		allFish[0].move(0);


		if (scrollPage < 3) {
			var w = pageWidth / 2;
			var h = Math.PI / (pageHeight * 2);
			scrollX = w * Math.cos(h * scrollYPos) - w;
			scrollY = scrollYPos;
		}


		if (scrollPage == 3) {
			scrollX = (scrollYPos - (4 * pageHeight)) / pageHeight * pageWidth / 2;
			scrollY = scrollYPos;
		}

		if (scrollPage > 2 && scrollPage < 18) {

			var TLleft = ((scrollYPos - (4 * pageHeight)) / pageHeight * pageWidth / 2) * (1200 / pageWidth);
			var TLevent = Math.round((TLleft + 810) / 810);
			var TLCurrent = Math.round((TLleft + 405) / 810);
			if (TLleft < elements.timeline.offsetWidth - 600) {
				elements.timeline.style.transform = "translateX(" + (-TLleft - 200) + "px)";
				elements.timelineBlobs.style.transform = "translateX(" + (-TLleft / 2 - 200) + "px)";

				if (PTLevent != TLevent) {
					elements.timelineTextDiv.style.width = "px";
					TLTwidth = 0;
					if (TLevent == 1) {
						locName = "Fukuoka";
						locRotation = 2.4;
						elements.timelineText.innerHTML = "I was born in a city in Japan called Fukuoka. I have been back many times to visit my extended family. It's a great place! 10/10 would recommend for the food alone!";
					}
					if (TLevent == 2) {
						locName = "Edinburgh";
						locRotation = 4.7;
						elements.timelineText.innerHTML = "Then we moved to Edinburgh! I don't remember much, but my parents loved it here. Apparently, I was given money by complete strangers all the time!  (I wish that still happened)<br><br>My parents' schooling and work will take us all over the place as you'll see...";
					}
					if (TLevent == 3) {
						locName = "Singapore";
						locRotation = 2.5;
						elements.timelineText.innerHTML = "My primary school years were spent in Singapore. The education system is super strict, but I'm glad I had that experience. I never had outstanding grades compared to my peers here but...";
					}
					if (TLevent == 4) {
						locName = "Utah";
						locRotation = 0.2;
						elements.timelineText.innerHTML = "After moving to America, I was acing every test! The school was actually starting to become fun! <br><br>There were also so many fun opportunities to grow in the United States.";
					}
					if (TLevent == 5) {
						locName = "Utah";
						locRotation = 0.2;
						elements.timelineText.innerHTML = "I entered my first robotics compeition called the First® Lego League at 12 years old. Man, it was fun. I was working with a team of my friends and we placed 4th place in the regional competition.<br><br>Not crazy, but we were overjoyed!";
					}
					if (TLevent == 6) {
						locName = "Utah";
						locRotation = 0.2;
						elements.timelineText.innerHTML = "The following year, we worked hard and knocked it out of the park! We moved past regionals, and had the highest score in the entire state!<br><br> Teamwork, baby!";
					}
					if (TLevent == 7) {
						locName = "Tokyo";
						locRotation = 2.2;
						elements.timelineText.innerHTML = "Back to the motherland. (literally)<br><br> I finished all of Highschool in Japan and ...";
					}
					if (TLevent == 8) {
						locName = "Utah";
						locRotation = 0.2;
						elements.timelineText.innerHTML = "I graduated highschool at 16.  And to be completely honest, I wish didn't rush so much. Sixteen is a little too early to be living alone. After a year, I felt like I needed a break.";
					}
					if (TLevent == 9) {
						locName = "Sendai";
						locRotation = 2.2;
						elements.timelineText.innerHTML = "I decided I wanted to go on a two year volunteer service opportunity for my church. I went to the Tohoku area, a place I'd never been before. It was the most fun I've ever had in my life. I met so many wonderful people.";
					}
					if (TLevent == 10) {
						locName = "Utah";
						locRotation = 0.2;
						elements.timelineText.innerHTML = "I returned back to BYU where I currently study today! So that's me. Thanks for enduring this long winded intro!<br><br><br><br><span style='opacity: 0.5'>keep scrolling...</span>";
					}
					PTLevent = TLevent;
				}
				if (Math.abs(TLleft - ((TLevent - 1) * 810)) < 200) {

					elements.timelineImages.forEach(image => {
						image.style.width = '400px';
						image.style.height = '400px';
					});
				}
				else {
					elements.timelineImages.forEach(image => {
						image.style.width = '200px';
						image.style.height = '200px';
					});
				}
			}
			else {
				elements.timeline.style.transform = "translateX(" + (-elements.timeline.offsetWidth + 400) + "px)";
				elements.timelineBlobs.style.transform = "translateX(" + (-elements.timeline.offsetWidth / 2 + 100) + "px)";

			}
			elements.timelineImgDiv.style.left = (-TLleft / 2) + "px";
			TLTwidth += (400 - TLTwidth) / 10;
			elements.timelineTextDiv.style.width = TLTwidth + "px";
			elements.timelineText.style.opacity = TLTwidth / 400;


			globeShow(TLleft, TLCurrent);
		}

		if (scrollPage > 3 && scrollPage < 17) {
			scrollX = 0;
			scrollY = 4 * pageHeight;
			allFish[0].m.x = width / 2;
			allFish[0].m.y = height * 0.7;
		}
		else {
			allFish[0].m.x = mouseX;
			allFish[0].m.y = mouseY;
		}
		if (scrollPage > 16) {
			scrollX = 0;
			scrollY = scrollYPos - (pageHeight * 13);
		}
		//	requestAnimationFrame(drawLoop);
		if (currentPage == 18) {
			var spacing = (scrollYPos - (pageHeight * currentPage)) / pageHeight;
			negative.style.letterSpacing = spacing * 10 + 5 + "px";
			negative.style.opacity = 1 - spacing;
		}
	}
	else {
		pageContent.style.left = "0px";
		pageContent.style.top = "0px";
		blobsEl.style.top = -scrollYPos / 1.2 + "px";
	}
	openMenu();
}







//var colorbank = ['#906b5e','#c0a88e','#c2bbab','#b8ab8e','#95958a','#bab78d','#676960','#e7dcd4','#d5c5ad','#f0e7cc','#ecdfcd','#b8ada2','#a5937b','#9fa195','#8d7669','#be8c6b','#acaea4','#c98769','#889281','#604a34'];
var colorbank = ['#8498af', '#bfb9ce', '#fee2e3', '#f5a3b7', '#715f65', '#f0d5b9', '#c0a88e', '#889281', '#e3a7c0'];

var alive = true;
var start = true;
var sharp = false;

var currentSkill = 0;
var ySkill = 0;

function changeImg() {
	if (alive) {
		allFish.length = 0;
		elements.aboutMeImg.src = "images/portfolio/dead.png";
		alive = false;
		document.getElementById('fish-button-bg').innerHTML = "click again to revive them!";
		document.getElementById('circleText').innerHTML = "Welp. &nbsp &nbsp Now they are all dead. &nbsp &nbsp Happy now?";
	}
	else {
		allFish.length = 0;
		for (var i = 0; i < elements.skillsList.length + 3; i++) {
			if (i < 3) {
				var smouse = createVector(Math.random() * width + width / 2, Math.random() * height + height);
				allFish.push(new koi(smouse.x, smouse.y, Math.random() * 10 + 15, smouse));
			}
			else {
				var smouse = createVector(AllGoops[0].x + shift[0], AllGoops[0].y + shift[1]);
				allFish.push(new koi(AllGoops[0].x, AllGoops[0].y, 25, smouse));
			}
		}
		elements.aboutMeImg.src = "images/portfolio/gross.webp";
		alive = true;
		document.getElementById('fish-button-bg').innerHTML = "you sure they need to die?🥺";
		document.getElementById('circleText').innerHTML = "Don't like the fish? Click here to kill them all!";
	}
}

function sharpen() {
	elements.newCircle.forEach(c => {
		c.style.width = Math.random() * 50 + 20 + "px";
		c.style.height = Math.random() * 50 + 20 + "px";
		c.style.transform = 'rotate(' + ((Math.random() * 720) - 360) + 'deg)';
		c.style.borderRadius = Math.floor(Math.random() * 4) * 10 + "px";
	})
}

function rounden() {
	elements.newCircle.forEach(c => {
		var randomW = Math.random() * 50;
		c.style.width = randomW + "px";
		c.style.height = randomW + "px";
		c.style.transform = 'rotate(0deg)';
		c.style.borderRadius = "500px";
	})
}

function portfolioJS() {
	if (start) {
		createGoop(0.7, 2.5, 250, '#906b5e');
		createGoop(0.2, 4.5, 250, '#e6ddd4');
		createGoop(1.2, 5.5, 250, '#b8aa8c');
		createGoop(0.2, 6.5, 250, '#93ae88');
		createGoop(1, 9.5, 600, '#93ae88');



		allFish.length = 0;
		for (var i = 0; i < elements.skillsList.length + 3; i++) {
			if (i < 3) {
				var smouse = createVector(Math.random() * width, Math.random() * height);
				allFish.push(new koi(smouse.x, smouse.y, Math.random() * 10 + 15, smouse));
			}
			else {
				var smouse = createVector(AllGoops[0].x + shift[0], AllGoops[0].y + shift[1]);
				allFish.push(new koi(AllGoops[0].x, AllGoops[0].y, 25, smouse));
			}
		}
		start = false;
	}
	pageHeight = window.innerHeight;
	pageWidth = window.innerWidth;

	currentPage = Math.floor((scrollYPos / pageHeight) + 0.5);
	scrollPage = Math.floor((scrollYPos / pageHeight));
	pageContent.style.left = -scrollX + "px";
	pageContent.style.top = -scrollY + "px";
	elements.bgCircleDiv.style.left = -scrollX / 2 + "px";
	elements.bgCircleDiv.style.top = -scrollY / 2 + "px";

	clear();
	noStroke();

	if (screen.width > 600 && screen.height > 600 && pageWidth > 600 && pageHeight > 600) {

		blobsEl.style.top = "0px";

		shift = [-scrollX / pageWidth * width, -scrollY / pageHeight * height];

		for (var i = 0; i < allFish.length; i++) {
			if (i < 3) {
				allFish[i].m.x = width * noise(frameCount / 200 + i * 25);
				allFish[i].m.y = height * noise(frameCount / 200 + 400 + i * 25);
				if (currentPage < 2) {
					allFish[0].m.x = mouseX;
					allFish[0].m.y = mouseY;
				}
				else {
					allFish[i].m.x = AllGoops[0].x + shift[0];
					allFish[i].m.y = AllGoops[0].y + shift[1];
				}
			}
			else {
				if (currentSkill > i - 4) {
					var yshift = height * 3 + shift[1];
					if (yshift < 0) {
						yshift = 0;
					}
					allFish[i].m.y = height * noise(frameCount / 200 + 400 + i * 25) + yshift;

					if (currentPage > 3) {
						allFish[i].m.x = width * noise(frameCount / 200 + i * 25) + shift[0] + width / 4;
					}
					else {
						allFish[i].m.x = width * noise(frameCount / 200 + i * 25);
					}
					if (i - 3 < (allFish.length - 3)) {
						if (currentPage > 5) {
							allFish[i].m.x = AllGoops[3].x + shift[0];
							allFish[i].m.y = AllGoops[3].y + shift[1];
						}
					}
					if (i - 3 < (allFish.length - 3) * 2 / 3) {
						if (currentPage > 4) {
							allFish[i].m.x = AllGoops[2].x + shift[0];
							allFish[i].m.y = AllGoops[2].y + shift[1];
						}
					}
					if (i - 3 < (allFish.length - 3) / 3) {
						if (currentPage > 3) {
							allFish[i].m.x = AllGoops[1].x + shift[0];
							allFish[i].m.y = AllGoops[1].y + shift[1];
						}
					}
				}
				else {
					allFish[i].m.x = AllGoops[0].x + shift[0];
					allFish[i].m.y = AllGoops[0].y + shift[1];
				}
				if (currentPage > 3) {
					allFish[i].bL += (15 - allFish[i].bL) / 10;
				}
				//			else{
				//				allFish[i].bL += (25-allFish[i].bL)/10;
				//			}
			}
			var over = false;
			for (var j = 0; j < AllGoops.length; j++) {
				if (distance(allFish[i].bx[0], allFish[i].by[0], AllGoops[j].x, AllGoops[j].y) < AllGoops[j].s / 5) {
					over = true;
				}
			}
			if (!over)
			//		if(distance(allFish[i].bx[0], allFish[i].by[0], AllGoops[0].x, AllGoops[0].y)> AllGoops[0].s/5)
			{
				if (currentSkill == i - 3) {
					allFish[i].display('#e38a9b');
				}
				else {
					allFish[i].display(100);
				}
			}

			allFish[i].move(i);
		}

		AllGoops.forEach(g => {
			g.display();
		})

		var w = pageWidth / 2;

		if (scrollPage < 2) {
			var h = Math.PI / (pageHeight);
			scrollX = -w / 2 * Math.cos(h * scrollYPos) + w / 2;
			scrollY = scrollYPos;
			elements.skillsList[0].style.backgroundColor = 'transparent';
			elements.skillsList[0].style.left = '0px';
		}
		if (scrollPage >= 2 && scrollPage < 4) {
			var h = Math.PI / (pageHeight * 2);
			scrollX = 0;
			scrollY = scrollYPos;
			ySkill = Math.round((scrollYPos - (2 * pageHeight)) / 80);
			if (ySkill > elements.skillsList.length - 1) {
				ySkill = elements.skillsList.length;
			}

			currentSkill = ySkill;
			for (var i = 0; i < elements.skillsList.length; i++) {

				if (i <= ySkill) {
					elements.skillsList[i].style.backgroundColor = 'red';
				}
				else {
					elements.skillsList[i].style.backgroundColor = 'transparent';
				}
				if (i == ySkill) {
					elements.skillsList[i].style.left = '100px';
				}
				else {
					elements.skillsList[i].style.left = '0px';
				}
				if (elements.skillsMouse[i]) {
					currentSkill = i;
				}

				if (i == currentSkill) {
					elements.skillsList[i].style.backgroundColor = '#e38a9b';
				}
			}
		}
		if (scrollPage > 3 && scrollPage < 7) {
			var h = Math.PI / (pageHeight);
			scrollX = -w / 2 * Math.cos(h * scrollYPos) + w / 2;
			scrollY = scrollYPos;
		}
		if (scrollPage > 6 && scrollPage < 10) {
			var h = Math.PI / (pageHeight * 2);
			scrollX = w;
			scrollY = scrollYPos;
		}
	}
	else {
		elements.bgCircleDiv.style.left = "0px";
		elements.bgCircleDiv.style.top = -scrollYPos / 2 + "px";
		pageContent.style.left = "0px";
		pageContent.style.top = "0px";
		blobsEl.style.top = -scrollYPos / 1.2 + "px";
		if (scrollPage > 6) {
			if (sharp) {
				sharpen();
				sharp = false;
			}
		}
		else {
			if (!sharp) {
				rounden();
				sharp = true;
			}
		}
	}
	openMenu();
}








let pCount = 10;
var drag = 0.95;
var bounciness = 1;
var attraction = 10;
const A = {
	x: new Float32Array(pCount),
	y: new Float32Array(pCount),
	xs: new Float32Array(pCount),
	ys: new Float32Array(pCount),
	size: new Float32Array(pCount),
	originalSize: new Float32Array(pCount),
	hit: new Array(pCount),
	color: new Array(pCount)
};
function projectsJS() {
	document.getElementById("frameCount").innerHTML = Math.round(frameRate());
	noStroke();
	for (var j = 0; j < pCount; j++) {
		if (j == pCount - 1) {
			A.originalSize[j] = 40;
			A.x[j] = mouseX;
			A.y[j] = mouseY;
		}
		else {
			var s = A.size[j] / 2;
			if (A.x[j] > width - s || A.x[j] < s) {
				A.x[j] = constrain(A.x[j], s, width - s);
				A.xs[j] *= -1.1;
			}
			if (A.y[j] > height - s || A.y[j] < s) {
				A.y[j] = constrain(A.y[j], s, height - s);
				A.ys[j] *= -1.1;
			}

			A.xs[j] *= drag;
			A.ys[j] *= drag;
			A.xs[j] += (noise(j, frameCount / 100) - 0.5) / 10;
			A.ys[j] += (noise(j, 50, frameCount / 100) - 0.5) / 10;
			//		A.ys[j]+=((height/2)-A.y[j])/10000;
			//		A.xs[j]+=((width/2)-A.x[j])/10000;


			var totalxs = 0;
			var totalys = 0;
			let con = 0;
			for (var i = j; i < pCount; i++) {
				var d = Math.sqrt(Math.pow(A.x[i] - A.x[j], 2) + Math.pow(A.y[i] - A.y[j], 2));

				var tx = (A.x[i] - A.x[j]) / 100;
				var ty = (A.y[i] - A.y[j]) / 100;
				if (i > j) {
					var cx = (A.x[j] - A.x[i]);
					var cy = (A.y[j] - A.y[i]);
					var cs = (A.size[j] + A.size[i]) / 2;
					var collisionX = 0;
					var collisionY = 0;
					if (d < cs) {
						collisionX = (((cs * cx) / d) - cx) / 2;
						collisionY = (((cs * cy) / d) - cy) / 2;
						A.hit[j] = true;
					}
					else {
						A.hit[j] = false;
					}
					A.x[j] += collisionX;
					A.y[j] += collisionY;
					A.x[i] -= collisionX;
					A.y[i] -= collisionY;
					if (A.hit[j]) {
						cx = (A.x[j] - A.x[i]);
						cy = (A.y[j] - A.y[i]);
						A.xs[j] += cx / (1000 / bounciness);
						A.ys[j] += cy / (1000 / bounciness);
						A.xs[i] -= cx / (1000 / bounciness);
						A.ys[i] -= cy / (1000 / bounciness);
					}
					if (i == pCount - 1) {
						A.xs[j] += collisionX;
						A.ys[j] += collisionY;
					}
					else {
						A.xs[j] += collisionX / 5;
						A.ys[j] += collisionY / 5;
					}
				}
				if (d < (A.originalSize[j] + A.originalSize[i]) * 1.5) {
					totalxs += tx;
					totalys += ty;
					con++;
				}
			}

			A.xs[j] += (totalxs / con) / (100 / attraction);
			A.ys[j] += (totalys / con) / (100 / attraction);
		}
		A.size[j] += (A.originalSize[j] - A.size[j]) / 10;
		A.x[j] += A.xs[j];
		A.y[j] += A.ys[j];
		fill('#f3d0cf');
		var size = A.size[j] * 1.6;
		if (screen.width < 600) {
			size = A.size[j] * 1;
		}
		ellipse(A.x[j], A.y[j], size);
	}
	blobsEl.style.top = -window.pageYOffset / 2 + "px";
	openMenu();
}




function contactJS() {
	openMenu();
	if (window.pageYOffset != elements.y) {
		document.getElementById('blob1div').style.top = -window.pageYOffset / 1.2 + "px";
		document.getElementById('blob2div').style.top = -window.pageYOffset / 2 + "px";
		elements.y = window.pageYOffset;
	}
}



function copyEmail() {
	navigator.clipboard.writeText('rasaichimori@gmail.com');
	document.getElementById('speechBubble').innerHTML = 'copied to clipboard!';
}



//other function definitions

function dynamicallyLoadScript(url) {
	var script = document.createElement("script");  // create a script DOM node
	script.src = url;  // set its src to the provided URL

	document.body.appendChild(script);
	return new Promise((resolve, reject) => {
		script.onload = function () {
			resolve();
		};
	})
}

function dynamicallyLoadStyle(url) {
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = url;
	link.type = 'text/css';

	document.head.appendChild(link);
	return new Promise((resolve, reject) => {
		link.onload = () => { resolve(); stylesLoaded = true; };
	})
}

function changeSize() {
	resizeCanvas(1200, 1200 * pageHeight / pageWidth, true);
	p5canvas.canvas.style.width = pageWidth + "px";
	p5canvas.canvas.style.height = pageHeight + "px";
}

function distance(x, y, x1, y1) {
	return Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2));
}

function mod(n, m) {
	return ((n % m) + m) % m;
}

function map_range(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function onSegment(p, q, r) {
	if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
		q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
		return true;

	return false;
}

function orientation(p, q, r) {
	let val = (q.y - p.y) * (r.x - q.x) -
		(q.x - p.x) * (r.y - q.y);

	if (val == 0) return 0; // collinear

	return (val > 0) ? 1 : 2; // clock or counterclock wise
}

function doIntersect(p1, q1, p2, q2) {
	let o1 = orientation(p1, q1, p2);
	let o2 = orientation(p1, q1, q2);
	let o3 = orientation(p2, q2, p1);
	let o4 = orientation(p2, q2, q1);

	if (o1 != o2 && o3 != o4) {
		return true;
	}
	else {
		return false;
	}
}
function isDefined(foo) {
	return typeof (foo) !== 'undefined'
}
