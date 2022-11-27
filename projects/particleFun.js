var kanvas;
var ctx;
let pCount = 300;

const A = {
//    x: new Float32Array(pCount),
//    y: new Float32Array(pCount),
//    xs: new Float32Array(pCount),
//    ys: new Float32Array(pCount)
	  x: new Array(pCount),
    y: new Array(pCount),
    xs: new Array(pCount),
    ys: new Array(pCount)
}; 

function changeSize(){
	if(window.innerWidth>800){
		if(fullScreenMode){
			resizeCanvas(window.innerWidth, window.innerHeight, true);
			p5canvas.canvas.style.width = window.innerWidth+"px";
			p5canvas.canvas.style.height = window.innerHeight+"px";	
		}
		else{
			resizeCanvas(500, 500, true);
			p5canvas.canvas.style.width = Math.min(window.innerWidth*0.8,500)+"px";
			p5canvas.canvas.style.height = Math.min(window.innerWidth*0.8,500)+"px";			
		}

	}
	else{
		resizeCanvas(500, 500, true);
		p5canvas.canvas.style.width = "500px";
		p5canvas.canvas.style.height = "500px";
	}
}
window.addEventListener('resize', changeSize);


var slider = [];
var values = [];
var fullScreenMode = false;
var p5canvas
function setup() {
	p5canvas = createCanvas(10, 10);
	p5canvas.parent("p5canv");
	for (var s = 0; s<6; s++){
		var slidername = 'slider'+s
		var valuename = 'value'+s
		slider[s] = document.getElementById(slidername);
		values[s] = document.getElementById(valuename);
	}
	changeSize();
	
	for (var j = 0; j < pCount; j++) {
    A.x[j] = Math.random()*p5canvas.width;
    A.y[j] = Math.random()*p5canvas.height;
    A.xs[j] = (Math.random()-0.5)*6;
    A.ys[j] = (Math.random()-0.5)*6;
  }
  kanvas = document.querySelector('canvas');
  ctx = kanvas.getContext('2d');
}



function draw() {
	background(bgColor);
	SettingSliders();
	mode1();
	updateFrameRate();
}

var bgColor = "#000";
function changeBg(element){
	var getBgColor = element.style.backgroundColor;
	bgColor = getBgColor;
}

var pColor = "#ff0000";
function changeColors(element){
	var getColor = element.style.backgroundColor;
	console.log(element);
	if(element.id=="color0"||element.id=="color1"){
		document.body.style.color = getColor;
	}
	pColor = getColor;
}

var cColor = "rgba(255,0,255,"
function changeConColors(element){
	var str = element.style.backgroundColor;
	cColor = str.substring(0, str.length - 1)+',';
}

function SettingSliders(){
	for(var s = 0; s<slider.length; s++){
		if(values[s].innerHTML != slider[s].value){
			values[s].innerHTML = slider[s].value;
			if(s==0){
				particleSize = parseInt(slider[0].value);
			}
			if(s==1){ 
				connectionRange = parseInt(slider[1].value);
			}			
			if(s==2){
				attraction = parseInt(slider[2].value);
			}			
			if(s==3){
				repulsion = parseInt(slider[3].value);
			}			
			if(s==4){
				pRange = parseInt(slider[4].value);
				if(pRange<16 && connectionRange>30){
					slider[1].value = 15;
				}
			}
			if(s==5){
				var newValue = parseInt(slider[5].value);
				if(pCount>newValue){
						var diff = pCount-newValue;
						A.x.splice(0,diff);
						A.y.splice(0,diff);
						A.xs.splice(0,diff);
						A.ys.splice(0,diff);
				}
				else{
					for(var i = 0; i<newValue-pCount; i++){
						A.x.push(Math.random()*width);
						A.y.push(Math.random()*height);
						A.xs.push((Math.random()-0.5)*6);
						A.ys.push((Math.random()-0.5)*6);
					}
				}
				pCount = newValue;
				
			}		
		}
	}
}

document.getElementById("fullScreen").addEventListener("change", (e) => {
	if(e.currentTarget.checked){
		 fullScreenMode = true;
			changeSize();
			frElement.style.position = "absolute";
			frElement.style.left = "10px";
			frElement.style.top = "10px";
//			document.getElementById("cont").style.left = "0px";
			document.getElementById("cont").style.top = "0px";
//			document.getElementById("cont").style.transform = "none";
			document.getElementById("cont").style.transform = "translate(-50%,0)";
			for(var j = 0; j<pCount; j++){
				A.x[j] += (window.innerWidth/2)-(500/2);
				A.y[j] += (window.innerHeight/2)-(500/2);
			}
	}
	else{
			for(var j = 0; j<pCount; j++){
				A.x[j] -= (window.innerWidth/2)-(500/2);
				A.y[j] -= (window.innerHeight/2)-(500/2);
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

var ShowFrameRate = true;
document.getElementById("displayFrameRate").addEventListener("change", (e) => {
	if(e.currentTarget.checked){
		  ShowFrameRate = true;
	}
	else{
			ShowFrameRate = false;
			frElement.innerHTML = "";
	}
});

var ShowConnections = true;
document.getElementById("displayConnections").addEventListener("change", (e) => {
	if(e.currentTarget.checked){
		  ShowConnections = true;
			document.getElementById("connectionRangeBox").style.paddingBottom = "30px";
			document.getElementById("connectionRangeBox").style.height = "30px";
			document.getElementById("connectionRangeBox").style.opacity = "1";
			document.getElementById("connectionColor").style.paddingBottom = "30px";
			document.getElementById("connectionColor").style.opacity = "1";
	}
	else{
			ShowConnections = false;
			document.getElementById("connectionRangeBox").style.paddingBottom = "0px";
			document.getElementById("connectionRangeBox").style.height = "0px";
			document.getElementById("connectionRangeBox").style.opacity = "0";			document.getElementById("connectionColor").style.paddingBottom = "0px";
			document.getElementById("connectionColor").style.opacity = "0";
	}
});


function glow(glowColor, blurriness, offsetX, offsetY){
  drawingContext.shadowOffsetX = offsetX;
  drawingContext.shadowOffsetY = offsetY;
  drawingContext.shadowBlur = blurriness;
  drawingContext.shadowColor = glowColor;
}

var particleSize = 3;
var connectionRange = 30;
var attraction = 5;
var repulsion = 30;
var pRange = 20;
function mode1(){
  for (var j = 0; j < pCount; j++) {
    
    if (A.x[j] > width || A.x[j] < 0) {
      A.x[j] = constrain(A.x[j], 0, width);
      A.xs[j] *= -1;
    }
    if (A.y[j] > height || A.y[j] < 0) {
      A.y[j] = constrain(A.y[j], 0, height);
      A.ys[j] *= -1;
    }
    var totalxs = 0;
    var totalys = 0;
    A.xs[j] *= 0.95;
    A.ys[j] *= 0.95;
    let con = 1;
    for (var i = 0; i < pCount; i++) {
      if (i != j) {
        var d = Math.sqrt(Math.pow(A.x[i]-A.x[j],2)+Math.pow(A.y[i]-A.y[j],2));
        if (d<90) {
          if(ShowConnections)
          {
						if(d<connectionRange){
							ctx.strokeStyle = cColor+10/d+')';
							ctx.beginPath();
							ctx.moveTo(A.x[j], A.y[j]);
							ctx.lineTo(A.x[i], A.y[i]);
							ctx.stroke();
						}
          }
          con++;
          var tx;
          var ty;
          if (d < pRange) {
            tx = (repulsion*15 * (A.x[j] - A.x[i]) / Math.pow(d, 2));
            ty = (repulsion*15 * (A.y[j] - A.y[i]) / Math.pow(d, 2));
          } else {
            tx = (attraction*15 * (A.x[i] - A.x[j]) / Math.pow(d, 3));
            ty = (attraction*15 * (A.y[i] - A.y[j]) / Math.pow(d, 3));
          }
          totalxs += tx;
          totalys += ty;
        }
      }
    }
    A.xs[j] += totalxs / con;
    A.ys[j] += totalys / con;
    
    var md = dist(mouseX, mouseY, A.x[j], A.y[j]);
    if (md < 50) {
      A.xs[j] += (5 * (A.x[j] - mouseX) / Math.pow(md, 1.2));
      A.ys[j] += (5 * (A.y[j] - mouseY) / Math.pow(md, 1.2));
    }
    A.x[j]+=A.xs[j];
    A.y[j]+=A.ys[j];
    
    fill(pColor);
		noStroke();
    ellipse(A.x[j], A.y[j], particleSize);
  }
}

var frElement = document.getElementById("frameRateDisplay");
function updateFrameRate(){
	if(ShowFrameRate){
		frElement.innerHTML = Math.round(frameRate());
	}
}
