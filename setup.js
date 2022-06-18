var loading = false;

window.addEventListener('resize',changeSize);
function changeSize(){
	resizeCanvas(lightbox.offsetWidth, lightbox.offsetHeight, true);
	scrolling = true;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function map_range(value, low1, high1, low2, high2) {
		return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

var scrolling = false;
function mouseWheel(event){
	scrolling = true;
}
var setupDone = false;
function setup() {
  angleMode(DEGREES);
	if(THREED){
  	canvas = createCanvas(windowWidth,windowHeight,WEBGL);
	}
	else{
  	canvas = createCanvas(windowWidth,windowHeight);
	}
  canvas.parent("lightbox"); 
	lightbox = document.getElementById('lightbox');
	
	changeSize();
	setupDone = true;
}

function distance(x,y,x1,y1){
	return Math.sqrt(Math.pow(x1-x,2)+Math.pow(y1-y,2));
}