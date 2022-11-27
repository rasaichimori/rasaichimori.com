
var welcomeTitle = document.getElementById('welcome-title');

function changeSize(){
	resizeCanvas(1200, 1200*pageHeight/pageWidth, true);
	canvas.canvas.style.width = pageWidth+"px";
	canvas.canvas.style.height = pageHeight+"px";
}

var dandelion = [];
var m,pm;
function setup() {
	canvas = createCanvas(10, 10);
	canvas.parent('flower');
	changeSize();
	m = createVector(0,0);
	pm = createVector(0,0);
	angleMode(DEGREES);
	dandelion.push(new flower(0, 0, 300, 60, 70, 0));
	dandelion.push(new flower(0, 0, 400, -60, 70, 0));
	dandelion.push(new flower(0, 0, 300, -110, 70, 0));
//	dandelion.push(new flower((canvas.width*1.15)-scrollX/pageWidth*canvas.width, (canvas.height*4)-scrollY/pageHeight*canvas.height+150, 300, 60, 70, 0));
}

var showMenu = false;
function draw() {
	pageHeight = window.innerHeight;
	pageWidth = window.innerWidth;
	scrollYPos = window.pageYOffset;

	currentPage = Math.floor((scrollYPos/pageHeight)+0.5);
	scrollPage = Math.floor((scrollYPos/pageHeight));
	clear();
	koiP5.clear();
	koiP5.noStroke();
	
	
	if(screen.width>600 && screen.height>600 && pageWidth>600 && pageHeight>600){

		pageContent.style.left = -scrollX+"px";
		pageContent.style.top = -scrollY+"px";	

		var w = pageWidth/2;
		var h = Math.PI/(pageHeight*2);
		scrollX = -w*Math.cos(h*scrollYPos)+w;
		scrollY = scrollYPos;
		if(currentPage>1){
			void welcomeTitle.offsetWidth;
			welcomeTitle.classList.add("bounce");
			welcomeTitle.style.transform = "rotate(-30deg)";
		}
		if(scrollPage<1){
			welcomeTitle.classList.remove("bounce");
			welcomeTitle.style.transform = "rotate(0deg)";
		}


		koiP5.shift = [-scrollX/pageWidth*koiP5.width/2,-scrollY/pageHeight*koiP5.height/2];

		for(var i = 0; i <koiP5.allFish.length; i++){
			koiP5.allFish[i].display(100);
			if(!koiP5.allFish[i].show){
				koiP5.allFish[i].speed = 15;
			}
			koiP5.allFish[i].move(i);
			if(i==0){
				koiP5.allFish[0].m.x = koiP5.mouseX;
				koiP5.allFish[0].m.y = koiP5.mouseY;
			}
			else{
				koiP5.allFish[i].m.x = koiP5.width * koiP5.noise(frameCount/200 + i * 25);
				koiP5.allFish[i].m.y = koiP5.height * koiP5.noise(frameCount/200+400 + i * 25);
			}
		}



		m.x = mouseX;
		m.y = mouseY;
		pm.x = pmouseX;
		pm.y = pmouseY;

		strokeWeight(1);
		stroke(255,0,0,100);
		line(m.x,m.y,pm.x,pm.y);


		if(scrollPage > 0 && scrollPage < 3){
			dandelion[0].awayFromScreen = false;
		}
		else{
			dandelion[0].awayFromScreen = true;
		}
		dandelion[0].calc();
		dandelion[0].base.x = (canvas.width*1.15)-scrollX/pageWidth*canvas.width;
		dandelion[0].base.y = (canvas.height*2)-scrollY/pageHeight*canvas.height+150;
		dandelion[0].display();


		if(scrollPage > 2 && scrollPage < 5){
			dandelion[1].awayFromScreen = false;
		}
		else{
			dandelion[1].awayFromScreen = true;
		}
		dandelion[1].calc();
		dandelion[1].base.x = (canvas.width*0.5)-scrollX/pageWidth*canvas.width;
		dandelion[1].base.y = (canvas.height*4.5)-scrollY/pageHeight*canvas.height+350;
		dandelion[1].display();


		if(scrollPage > 4 && scrollPage < 8){
			dandelion[2].awayFromScreen = false;
		}
		else{
			dandelion[2].awayFromScreen = true;
		}
		dandelion[2].calc();
		dandelion[2].base.x = (canvas.width*1.25)-scrollX/pageWidth*canvas.width;
		dandelion[2].base.y = (canvas.height*7.2)-scrollY/pageHeight*canvas.height-190;
		dandelion[2].display();


		if(canvas.canvas.style.width != windowWidth+"px" || canvas.canvas.style.height != windowHeight+"px"){
			changeSize();
			koiP5.changeSize();
		}
		blobsEl.style.top = "0px";
		if(scrollPage>0 && !showMenu){
			showMenu = true;
			menu.style.transform="rotate(2deg) translate(-90%,-5%)";
		}
		if(showMenu){
			openMenu();
		}
	}
	else{
		pageContent.style.left = "0px";
		pageContent.style.top = "0px";
		blobsEl.style.top = -scrollYPos/2+"px";
	}
};