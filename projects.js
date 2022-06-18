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
var CanvasSize = 600;
var canvas;
function changeSize() {
	resizeCanvas(CanvasSize, CanvasSize*windowHeight/windowWidth, true);
	canvas.canvas.style.width = windowWidth+"px";
	canvas.canvas.style.height = windowHeight+"px";
}
window.addEventListener('resize', changeSize);

function setup() {
	canvas = createCanvas(10, 10);
	changeSize();
	for (var i = 0; i < pCount; i ++) {
			A.x[i] = Math.random()*window.innerWidth;
			A.y[i] = Math.random()*window.innerHeight;
			A.xs[i] = (Math.random()-0.5)*20;
			A.ys[i] = (Math.random()-0.5)*20;
			A.size[i] = 0;
			A.originalSize[i] = Math.random()*50+20;
			A.color[i] = createVector(Math.random()*55, Math.random()*(30), Math.random()*(30));;
	}
}

var blobsEl = document.getElementById('blobs');

function draw() {
	document.getElementById("frameCount").innerHTML = Math.round(frameRate());
	clear();
	noStroke();
	for (var j = 0; j < pCount; j++) {
		if(j == pCount-1){
			A.originalSize[j] = 20;
			A.x[j] = mouseX;
			A.y[j] = mouseY;
		}
		else{
		var s = A.size[j]/2;
		if (A.x[j] > width-s || A.x[j] < s) {
			A.x[j] = constrain(A.x[j], s, width-s);
			A.xs[j] *= -1.1;
		}
		if (A.y[j] > height-s || A.y[j] < s) {
			A.y[j] = constrain(A.y[j], s, height-s);
			A.ys[j] *= -1.1;
		}

		A.xs[j] *= drag;
		A.ys[j] *= drag;
		A.xs[j] += (noise(j,frameCount/100)-0.5)/10;
		A.ys[j] += (noise(j,50,frameCount/100)-0.5)/10;
//		A.ys[j]+=((height/2)-A.y[j])/10000;
//		A.xs[j]+=((width/2)-A.x[j])/10000;
		

		var totalxs = 0;
		var totalys = 0;
		let con = 0;
		for (var i = j; i < pCount; i++) {
				var d = Math.sqrt(Math.pow(A.x[i]-A.x[j],2)+Math.pow(A.y[i]-A.y[j],2));

				var tx = (A.x[i] - A.x[j]) /100;
				var ty = (A.y[i] - A.y[j]) /100;
				if(i>j)
				{
					var cx = (A.x[j]-A.x[i]);
					var cy = (A.y[j]-A.y[i]);
					var cs = (A.size[j]+A.size[i])/2;
					var collisionX = 0;
					var collisionY = 0;
					if(d<cs){
						collisionX = (((cs*cx)/d)-cx)/2;
						collisionY = (((cs*cy)/d)-cy)/2;
						A.hit[j] = true;
					}
					else{
						A.hit[j] = false;
					}
					A.x[j] += collisionX;
					A.y[j] += collisionY;
					A.x[i] -= collisionX;
					A.y[i] -= collisionY;
					if(A.hit[j]){
						cx = (A.x[j]-A.x[i]);
						cy = (A.y[j]-A.y[i]);
						A.xs[j] += cx/(1000/bounciness);
						A.ys[j] += cy/(1000/bounciness);
						A.xs[i] -= cx/(1000/bounciness);
						A.ys[i] -= cy/(1000/bounciness);
					}
					if(i == pCount-1){
						A.xs[j]+=collisionX;
						A.ys[j]+=collisionY;
					}
					else{
						A.xs[j]+=collisionX/5;
						A.ys[j]+=collisionY/5;
					}
				}
				if(d<(A.originalSize[j]+A.originalSize[i])*1.5){
					totalxs += tx;
					totalys += ty;
					con++;
				}
		}

		A.xs[j] += (totalxs / con)/(100/attraction);
		A.ys[j] += (totalys / con)/(100/attraction);
		}
		A.size[j] += (A.originalSize[j]-A.size[j])/10;
		A.x[j]+=A.xs[j];
		A.y[j]+=A.ys[j];
		fill('#f3d0cf');
		var size = A.size[j]*1.6;
		if(screen.width<600){
			size = A.size[j]*1;
		}
		ellipse(A.x[j],A.y[j],size);
	}
	if(canvas.canvas.style.width != windowWidth+"px" || canvas.canvas.style.height != windowHeight+"px"){
		changeSize();
	}
	blobsEl.style.top = -window.pageYOffset/2+"px";
	openMenu();
};


