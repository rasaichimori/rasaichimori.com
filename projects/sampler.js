var source = 'music/luxury%20sample.mp3';
const audio = document.getElementById("audio");
audio.src = source;

audio.onended = function() {
   playButtonPlay();
};

function newAudio(file){
	songNameElement.innerHTML = file.name;
	var audioURL = URL.createObjectURL(file);
	audio.src = audioURL;
	drawAudio(audioURL);
}


window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

var displayMouseX,displayMouseY;
const display = document.getElementById("display");
const displayCTX = display.getContext("2d");
display.width = display.offsetWidth;
display.height = display.offsetHeight;
displayCTX.translate(0, display.offsetHeight / 2); 


const TL = document.getElementById("timelineDisplay");
const TLCTX = TL.getContext("2d");
TL.width = TL.offsetWidth;
TL.height = TL.offsetHeight;
TLCTX.translate(0, TL.offsetHeight / 2); 







var playButton = document.getElementById("play-button");
playButton.style.backgroundImage = 'url("images/play.png")';
playButton.addEventListener("mousedown",function(e){
	checkPlayButton();
})
function checkPlayButton(){		
	if(playButton.style.backgroundImage=='url("images/play.png")'){
		playButtonPause();
		audio.preservesPitch = false;
		audio.playbackRate = 1;
		audio.play();
	}
	else{
		playButtonPlay();
		audio.pause();
		audio.currentTime = 0;
		
	}
}
document.addEventListener('keyup', event => {
	if (event.code === 'Space') {
		checkPlayButton();
	}
})





function playButtonPause(){
	playButton.style.backgroundImage = 'url("images/pause.png")';
}
function playButtonPlay(){
	playButton.style.backgroundImage = 'url("images/play.png")';
}
/**
 * Retrieves audio from an external source, the initializes the drawing function
 * @param {String} url the url of the audio we'd like to fetch
 */
const drawAudio = url => {
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => filterData(convertBuffer(audioBuffer)));
};

drawAudio(source);

/**
 * Filters the AudioBuffer retrieved from an external source
 * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
 * @returns {Array} an array of floating point numbers
 */
const convertBuffer = audioBuffer => {
	return audioBuffer.getChannelData(0); // We only need to work with one channel of data
}

var rawData = [];
const filterData = (Data,method,sampleNumber,startPercent,endPercent) => {
  rawData = Data;
	var startPos = Math.round(rawData.length*startPercent);
	var endPos = Math.round(rawData.length*endPercent);
	const sectionLength = endPos-startPos;
  const samples = sampleNumber; // Number of samples we want to have in our final data set
  const blockSize = Math.floor(sectionLength / samples); // the number of samples in each subdivision
  const filteredData = [];
  for (let i = 0; i < samples; i++) {
    let blockStart = (blockSize*i)+startPos; // the location of the first sample in the block
    let sum = 0;
		let n = 0;
    for (let j = 0; j < blockSize; j++) {
			if(method == "avg"){
//				if(Math.abs(rawData[blockStart + j])>sum){
//					sum = rawData[blockStart + j];
//					
//				}
				sum += rawData[blockStart + j];
				n++;
			}
			else{
				if(Math.abs(rawData[blockStart + j])>sum){
					sum = Math.abs(rawData[blockStart + j]);
				}
			}
    }
		if(method == "avg"){
			filteredData.push(sum/n)
		}
		else
		{
    	filteredData.push(sum);
		}
  }
  return filteredData;
};

/**
 * Normalizes the audio data to make a cleaner illustration 
 * @param {Array} filteredData the data from filterData()
 * @returns {Array} an normalized array of floating point numbers
 */
const normalizeData = filteredData => {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
}

/**
 * Draws the audio file into a display element.
 * @param {Array} normalizedData The filtered array returned from filterData()
 * @returns {Array} a normalized array of data
 */
const draw = (normalizedData,canvas,type) => {
  // draw the line segments
  const width = canvas.offsetWidth / normalizedData.length;
  for (let i = 0; i < normalizedData.length; i++) {
    const x = width * i;
    let height = normalizedData[i] * canvas.offsetHeight/3;
		if(type=="main"){
			let height2 = 0;
			if(i<normalizedData.length-1){
				height2 = normalizedData[i+1] * canvas.offsetHeight/3;
			}
    	drawLineSegment(x, height, height2, width);
		}
		else{
			if (height < 0) {
					height = 0;
			} 
			if (height > canvas.offsetHeight / 2) {
					height = canvas.offsetHeight / 2;
			}
    	drawTLLineSegment(x, height, width, (i + 1) % 2);
		}
  }
};

/**
 * A utility function for drawing our line segments
 * @param {AudioContext} displayCTX the audio context 
 * @param {number} x  the x coordinate of the beginning of the line segment
 * @param {number} height the desired height of the line segment
 * @param {number} width the desired width of the line segment
 * @param {boolean} isEven whether or not the segmented is even-numbered
 */
const drawTLLineSegment = (x, height, width, isEven) => {
  TLCTX.lineWidth = 1; // how thick the line is
  TLCTX.strokeStyle = "#fff"; // what color our line is
  TLCTX.beginPath();
  height *= isEven*2-1;
  TLCTX.moveTo(x, 0);
  TLCTX.lineTo(x, height);
  TLCTX.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
  TLCTX.lineTo(x + width, 0);
  TLCTX.stroke();
};

const drawLineSegment = (x, height, height2, width) => {
  displayCTX.lineWidth = 1; // how thick the line is
  displayCTX.strokeStyle = "#fff"; // what color our line is
  displayCTX.beginPath();
  displayCTX.moveTo(x, height);
  displayCTX.lineTo(x + width, height2);
  displayCTX.stroke();
};




const looper = setInterval(loop,1000/60);
var sp = 0; //start percentage of song
var ep = 1; //end percentage of song
var cp = 0.5; //center percentage of song
var vp = 0.5; //view percentage of song
var dx = 0.5; //drag percentage
var cx = 0.5; 
var pdx = 0;
var mx = 0; //mouse percentage of display
function loop(){
	if(scrollY<0){
		scrollY = 0;
	}
	if(mouseDown){
		Ydifference = mouseY-dragMouseY;
		Xdifference = mouseX-dragMouseX;
		vp = 10/(scrollY+Ydifference);
		if((scrollY+Ydifference)<1){
			vp = 1;
		}
		
		dx = pdx + Xdifference/display.width;
//		cp = displayMouseX/display.width;
	}
	else{
		dragMouseX = mouseX;
		dragMouseY = mouseY;
		pdx = dx;
	}
	
	sp=constrain(cp-(dx*vp),0,1-vp);
	ep=constrain(cp+((1-dx)*vp),vp,1);
	mx = (cp-sp)/vp;
	
	
	
	
	
	TLCTX.clearRect(0, -TL.height/2, TL.width, TL.height);
	TLCTX.fillStyle = '#666';
	TLCTX.fillRect(sp*TL.width, -TL.height/2, ep*TL.width-sp*TL.width, TL.height);
	displayCTX.clearRect(0, -display.height/2, display.width, display.height);
	
	draw(normalizeData(filterData(rawData,"abs",1250,0,1)),TL,"TL");
	
	cursorLine(cp,TL,TLCTX,"#0000ff");
//	cursorLine(audio.currentTime/audio.duration,TL,TLCTX,"#0000ff");
	
	
	
	draw(filterData(rawData,"avg",1000,sp,ep),display,"main");
	cursorLine(mx,display,displayCTX,"#fff");
	
	cursorLine(cx,TL,TLCTX,"#fff");
}






function cursorLine(Xpercentage,canvas,ctx,color){
	ctx.lineWidth = 1; // how thick the line is
  ctx.strokeStyle = color; // what color our line is
  ctx.beginPath();
  ctx.moveTo(Xpercentage*canvas.width, -canvas.height/2);
  ctx.lineTo(Xpercentage*canvas.width, canvas.height/2);
  ctx.stroke();
}





onmousemove = function(e){
	getMousePos(display, e);
};


var mouseX = 0;
var mouseY = 0;
function getMousePos(display, evt) {
  var rect = display.getBoundingClientRect();
	displayMouseX = constrain(evt.clientX - rect.left,0,display.width);
	displayMouseY = constrain(evt.clientY - rect.top,0,display.height-1);
	mouseX = evt.clientX;
	mouseY = evt.clientY;
}

var dragMouseY = 0;
var dragMouseX = 0;
var Ydifference = 0;
var Xdifference = 0;
var scrollY = 0;
var mouseDown = false;
display.addEventListener("mousedown",  event =>{
	mouseDown = true;
//	cp = (displayMouseX/display.width)*vp+sp;
});

document.addEventListener("mouseup",  event =>{
	mouseDown = false;
	scrollY+=Ydifference;

	Ydifference = 0;
});

function dist(x,y,x1,y1){
	return Math.sqrt(Math.pow((x1-x),2)+Math.pow((y1-y),2))
}
function constrain(number, min, max){
	var newNum = number;
	if(newNum>max){
		newNum = max;
	}
	if(newNum<min){
		newNum = min;
	}
//	var newNum = Math.min(Math.max(parseFloat(number), min), max);
	return newNum;
}





//
//var wavesurfer = WaveSurfer.create({
//    container: '#waveform',
//		scrollParent: true,
//		forceDecode: 'true',
//		fillParent: 'false'
//});
//wavesurfer.load(source);

//var mouseX = 0;
//var mouseY = 0;
//onmousemove = function(e){
//	mouseX = e.clientX;
//	mouseY = e.clientY;
//  wavesurfer.zoom(Number(mouseY));
//};
