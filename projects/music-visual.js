var input = document.getElementById("uploader");

function changeSize(){
	resizeCanvas(1200, 1200*window.innerHeight/window.innerWidth, true);
	p5canvas.canvas.style.width = window.innerWidth+"px";
	p5canvas.canvas.style.height = window.innerHeight+"px";
}
window.addEventListener('resize', changeSize);


var song;
var output;
var fft;
var mute;
var sy = [];

var source = 'music/skyburst.mp3';

var Vwidth = 400;
var Vheight = 150;
var detailS = 4096;
var curveSmoothness = 5;
var speedSmoothness = 2;
var numberOfBars = 300;
var slider = [];
var values = [];


var particles = [];
var particleAmount = 50;

var loadingDone = false;

var p5canvas;
function setup() {
	"use strict";
	p5canvas = createCanvas(10, 10);
	p5canvas.parent("p5canv");
	for (var s = 0; s<5; s++){
		var slidername = 'slider'+s
		var valuename = 'value'+s
		slider[s] = document.getElementById(slidername);
		values[s] = document.getElementById(valuename);
	}
	song = loadSound(source,Loading);
  output = loadSound(source,Loading);
	
  for(i = 0; i < numberOfBars+curveSmoothness; i++) {
    sy.push(0);
  }
  
  for(var i = 0; i<particleAmount; i++){
      particles[i] = new particle(
      i,
      random(1,4),
      random(0,360),
      random(0,0.5)/10
    );
  }
	changeSize()
}

function CreateFFT(){
  song.playMode('untilDone');
  output.playMode('untilDone');
  song.disconnect();
  fft = new p5.FFT(0, detailS);
  fft.setInput(song);

  mute = new p5.EQ();
  mute.amp(0);
  song.connect(mute);
  mute.connect();
  
	loadingDone = true;
}


function draw() {
	if(loadingDone){
		BringSettings();
		SettingSliders();
		SetTimeLine();
		SetPlayButton();
		SetTLDisplay();
		noFill();
		var w = Vwidth / numberOfBars; 
		var x = (width-Vwidth)/2;
		var y = (height-Vheight)/2;
		var c = document.body.style.color;
		var spectrum = [];
		var bassEnergy = 0;
			spectrum = fft.analyze();
			bassEnergy = fft.getEnergy("bass");
		var sm = (numberOfBars/150)*curveSmoothness;
		var ss = speedSmoothness;
//		background(0,100);
		backgroundShake(bassEnergy);
		clear();
		stroke(c);
		strokeWeight(30);
		glow(color(255,255,255,bassEnergy),100,0,height*2);
		ellipse(width/2,height/2-height,bassEnergy/2+150);
		glow(0,0,0,0);
		particles.forEach(p => {
			p.create(bassEnergy);
		});

		beginShape();
		vertex(x, y+Vheight-height);
		for (var i = 0; i < numberOfBars+curveSmoothness; i++) {
			var exp = 1.5;
			var divider = 10*(4096/detailS);
			var multiplier = i*(150/numberOfBars);
			var freq = round(pow(multiplier,exp)/divider);
			var amp = (spectrum[freq]-120)/0.5;
			if(i<numberOfBars){
				sy[i]+=(amp-sy[i])/ceil((ss/2)+((ss*i)/numberOfBars));
				var totalY = 0;
				for(var j = 0; j<sm; j++){
					var add = j;
					totalY+=sy[i+add];
				}
				var vol = -constrain(map(totalY/sm, 0, 300, 0, Vheight),0,Vheight);
				stroke(c);
				strokeWeight(sw);
				line(x+(i*w), y+Vheight, x+(i*w), y+Vheight+vol);
				vertex(x+(i*w),y+Vheight+vol-height)
			}
			else{
				freq = round(10*pow(multiplier,exp)/divider);
				sy[i]=(spectrum[freq])/2; 
			}
		}
		vertex(x+Vwidth-w, y+Vheight-height);
		strokeWeight(20);
		glow(color(255,255,255,bassEnergy),100,0,height*2);
		endShape(CLOSE);
	}
//	Vwidth = mouseY;
//	Vheight = mouseX;
}

class particle{
  constructor(id,size,angle,accel){
    this.id = id;
    this.x = random(width);
    this.y = random(height);
    this.size = size;
    this.speed = 0;
    this.a = angle;
    this.acc = accel;
  }
  create(bassEnergy){
    stroke(200,dist(this.x,this.y,width/2,height/2));
    var bassMultiplier = constrain(bassEnergy-100,0,300)
    this.x+=this.speed*cos(this.a)*bassMultiplier;
    this.y+=this.speed*sin(this.a)*bassMultiplier;
    this.x+=(noise(this.id,frameCount/1000)-0.5)*((bassMultiplier/10)+1);
    this.y+=(noise(this.id,frameCount/1000,this.a)-0.5)*((bassMultiplier/10)+1);
    strokeWeight(this.size+this.speed);
    point(this.x,this.y);
    if(dist(this.x,this.y,width/2,height/2)>width/2){
      this.x = width/2;
      this.y = height/2;
      this.speed = 0;
      this.a = random(0,360);
      this.acc = random(0,0.5)/100;
    }
    this.speed += this.acc*(bassEnergy/100);
  }
}

var settingsBox = document.getElementById('slider-cont');
var settingsSign = document.getElementById('settings');
function BringSettings(){
	if(window.innerWidth>800){
		if(mouseX>width-450){
			settingsBox.style.transform = "translateX(0px)";
			settingsSign.style.display = "none";
		}
		else{
			if(!mouseIsPressed){
				settingsBox.style.transform = "translateX(400px)";
			}
		}
	}
	else{
		settingsSign.style.display = "none";
		settingsBox.style.transform = "translateX(0px)";
	}
}

function SettingSliders(){
	for(var s = 0; s<slider.length; s++){
		if(values[s].innerHTML != slider[s].value){
			values[s].innerHTML = slider[s].value;
			if(s==0){
				curveSmoothness = parseInt(slider[0].value);
			}
			if(s==1){
				speedSmoothness = parseInt(slider[1].value);
			}			
			if(s==2){
				numberOfBars = parseInt(slider[2].value);
			}			
			if(s==3){
				sw = parseInt(slider[3].value);
			}			
			if(s==4){
				Vwidth = parseInt(slider[4].value);
			}
			if(s==5){
				Vheight = parseInt(slider[5].value);
			}
		}
	}
}


var TLfirst = false;
function SetTimeLine(){
	if(!TLdragging){
		if(TLfirst){
			var jumpTo = (timeline.value/1001)*song.duration();
			if(playButton.style.backgroundImage=='url("images/play.png")'){
				playButton.style.backgroundImage='url("images/pause.png")';
				song.play(0,1,1,0);
				output.play(0,1,1,0);
			}
			song.jump(jumpTo);
			output.jump(jumpTo);
			TLfirst = false;
		}
		var time = round(1000*song.currentTime()/song.duration());
		updateTimeline(time);
		timeline.value = time;
	}
	else{
		TLfirst = true;
	}
}


function SetPlayButton(){
	if(playButton.style.backgroundImage=='url("images/pause.png")'){
		if(!song.isPlaying()){
			if(timeline.value>999){
				playButton.style.backgroundImage='url("images/play.png")';
			}
			else{
				song.play();
				output.play();
			}
		}
	}
	if(playButton.style.backgroundImage=='url("images/play.png")'){
		if(song.isPlaying()){
			song.pause();
			output.pause();
		}
	}
}


var timelineCD = document.getElementById('timeline-current-display');
var timelineDD = document.getElementById('timeline-duration-display');
function SetTLDisplay(){
	timelineCD.innerHTML = timeConvert(song.currentTime());
	timelineDD.innerHTML = timeConvert(song.duration());
}

function timeConvert(seconds){
	var mins = (Math.floor(seconds/60)).toLocaleString(undefined, {minimumIntegerDigits: 2, useGrouping:false});
	var secs = (Math.floor(seconds % 60)).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
	return mins+':'+secs;
}


var bg = document.getElementById('bg');
function backgroundShake(shakeAmount){
	if(frameCount%5==1){
		var n = (shakeAmount)/10;
		var blurAmount = map(255-shakeAmount,0,255,10,20);
		var bgX = ((noise(frameCount/100)-0.5)*n);
		var bgY = ((noise(frameCount/100,50)-0.5)*n);
		bg.style.backgroundPositionX = (bgX-20)+'px';
		bg.style.backgroundPositionY = (bgY-300)+'px';
		bg.style.filter= 'blur('+blurAmount+'px)';
		bg.style.WebkitFilter = 'blur('+blurAmount+'px)';
	}
}

function glow(glowColor, blurriness, offsetX, offsetY){
  drawingContext.shadowOffsetX = offsetX;
  drawingContext.shadowOffsetY = offsetY;
  drawingContext.shadowBlur = blurriness;
  drawingContext.shadowColor = glowColor;
}


function getNewSong(){
	loadingDone = false;
	playButton.style.backgroundImage = 'url("images/play.png")';
  loaded = 0;
  song.stop();
  output.stop();
  song = loadSound(input.files[0],Loading);
  output = loadSound(input.files[0],Loading);
}

var bd1Element = document.getElementById("bd1");
var bd2Element = document.getElementById("bd2");
var glitchElement = document.getElementById("glitch-cont");
var enterElement = document.getElementById("enter");
var loaded = 0;
function Loading(){
  loaded++;
  if(loaded>1){
    loaded = 0;
    CreateFFT();
		glitchElement.style.opacity = "0";
		enterElement.style.opacity = "1";
  }
}

function enter(){
		bd1Element.style.height = "0%";
		bd1Element.style.top = "-10px";
		bd2Element.style.height = "0%";
		bd2Element.style.bottom = "-10px";
		enterElement.style.opacity = "0";
		enterElement.style.display = "none";
		playButton.style.backgroundImage='url("images/pause.png")'
}

