var homeCont = document.getElementById('home-cont');
var inputEl = document.getElementById("password-input");
var messageEl = document.getElementById("message");
var imageEL = document.querySelector('.openseadragon-canvas canvas');
//var imageEL = document.getElementById("full-image");

//var zoomAmount = 100;
//function zoomIn(){
//	setStyle(window.innerWidth/2,window.innerHeight/2,(zoomAmount*1.25)-zoomAmount);
//}
//function zoomOut(){
//	setStyle(window.innerWidth/2,window.innerHeight/2,(zoomAmount*0.8)-zoomAmount);
//}
//function reset(){
//	zoomAmount = 100;
//	x = y = PdivX = PdivY = 0;
//	setStyle(window.innerWidth/2,window.innerHeight/2,0);
//}

function checkPasscode(){
	if(inputEl.value == '06102021'){
		homeCont.style.opacity = 0;
		homeCont.style.pointerEvents = 'none';
	}
	else{
		messageEl.style.color = '#ff9ecb';
		messageEl.innerHTML = 'sorry! wrong passcode!';
	}
}

inputEl.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    checkPasscode();
  }
});

//var dragX;
//var dragY;
//var PdivX = 0;
//var PdivY = 0;
//
//var mouseX, mouseY;
//document.addEventListener("mousemove", (e)=>{
//	e.preventDefault();
//	if(mouseDown){
//		x = e.clientX-dragX+PdivX;
//		y = e.clientY-dragY+PdivY;
//		imageEL.style.left = x+"px";
//		imageEL.style.top = y+"px";
//	}
//	else{
//		PdivX = x;
//		PdivY = y;
//		dragX = mouseX;
//		dragY = mouseY;
//	}
//	mouseX = e.clientX;
//	mouseY = e.clientY;
//});

var mouseDown = false;

document.querySelector('#imageDiv').addEventListener("mousedown", (e)=>{
//	e.preventDefault();
	
	console.log("d");
	imageEL.style.cursor = 'grabbing';
	mouseDown = true;
});
document.addEventListener("mouseup", (e)=>{
	e.preventDefault();
	imageEL.style.cursor = 'grab';
	mouseDown = false;
});

//
//var x = 0;
//var y = 0;

//document.addEventListener("wheel", (e)=> {
//	if(!mouseDown){
//		setStyle(mouseX,mouseY,e.deltaY*-0.001*zoomAmount);
//	}
//});

//function setStyle(targetX,targetY,diff){
//	PdivX = x;
//	PdivY = y;
//	dragX = mouseX;
//	dragY = mouseY;
//	zoomAmount+=diff;
//	x = targetX-((targetX-x)/(zoomAmount-(diff)))*(zoomAmount);
//	y = targetY-((targetY-y)/(zoomAmount-(diff)))*(zoomAmount);
//	imageEL.style.width = zoomAmount+"%";
//	imageEL.style.left = x+"px";
//	imageEL.style.top = y+"px";
//}
//reset();



//yeah, I know it's not a very secure way to store a passcode, but this is just a quick thing for my girlfirend alright? At least she would think that no one can access it but her. Leave me alone.