var scrollYPos = 0;

var pageContent = document.getElementById('pageContent');

var bgCircleDiv = document.getElementById('bg-circles');

var skillsList = document.querySelectorAll('.skill-list li');

var blobsEl = document.getElementById('blobs');


var skillsMouse = [];

//var colorbank = ['#906b5e','#c0a88e','#c2bbab','#b8ab8e','#95958a','#bab78d','#676960','#e7dcd4','#d5c5ad','#f0e7cc','#ecdfcd','#b8ada2','#a5937b','#9fa195','#8d7669','#be8c6b','#acaea4','#c98769','#889281','#604a34'];
var colorbank = ['#8498af','#bfb9ce','#fee2e3','#f5a3b7','#715f65','#f0d5b9','#c0a88e','#889281','#e3a7c0'];

var newCircle = [];
for(var i = 0; i<40; i++){
	newCircle[i] = document.createElement("div");
	newCircle[i].classList.add('bg-circle');
	
	if(i<20){
		newCircle[i].style.left = Math.random()*100+"vw";
		newCircle[i].style.top = Math.random()*350+"vh";		
	}
	else{
		newCircle[i].style.left = Math.random()*100+25+"vw";
		newCircle[i].style.top = Math.random()*100+350+"vh";
	}
	newCircle[i].style.backgroundColor = colorbank[Math.round(Math.random()*colorbank.length-1)];
	
	
	var randomW = Math.random()*50;
	newCircle[i].style.width = randomW+"px";
	newCircle[i].style.height = randomW+"px";
	
//	newCircle[i].style.width = Math.random()*30+"px";
//	newCircle[i].style.height = Math.random()*30+"px";
//	newCircle[i].style.transform = 'rotate('+Math.random()*360+'deg)';

	bgCircleDiv.appendChild(newCircle[i]);
}

var aboutMeImg = document.getElementById('aboutme-img');
var alive = true;
function changeImg(){
	if(alive){
		koiP5.allFish.length = 0;
		koiP5.allFish.NumberOfFish = 0; 
		aboutMeImg.src = "images/portfolio/dead.png";
		alive = false;
		document.getElementById('fish-button-bg').innerHTML = "click again to revive them!";
		document.getElementById('circleText').innerHTML = "Welp. &nbsp &nbsp Now they are all dead. &nbsp &nbsp Happy now?";
	}
	else{
		koiP5.allFish.length = 0;
		koiP5.allFish.NumberOfFish = 0;
		for(var i = 0; i<skillsList.length+3; i++){
			koiP5.NumberOfFish++;
			if(i<3){
				var smouse = koiP5.createVector(Math.random()*koiP5.width+koiP5.width/2, Math.random()*koiP5.height+koiP5.height);	
				koiP5.createKoi(smouse.x, smouse.y,Math.random()*10+15,smouse);
			}
			else{
				var smouse = koiP5.createVector(goopP5.AllGoops[0].x + koiP5.shift[0], goopP5.AllGoops[0].y + koiP5.shift[1]);	
				koiP5.createKoi(goopP5.AllGoops[0].x, goopP5.AllGoops[0].y,25,smouse);
			}
		}
		aboutMeImg.src = "images/portfolio/gross.webp";
		alive = true;
		document.getElementById('fish-button-bg').innerHTML = "you sure they need to die?🥺";
		document.getElementById('circleText').innerHTML = "Don't like the fish? Click here to kill them all!";
	}
}


for(var i = 0; i<skillsList.length; i++){
	skillsMouse.push(false);
	skillsList[i].setAttribute('id',i);
	
	skillsList[i].addEventListener('mouseover',e=>{
		skillsMouse[e.srcElement.id] = true;
	});	
	skillsList[i].addEventListener('mouseout',e=>{
		skillsMouse[e.srcElement.id] = false;
	});
}


document.getElementById('all-projects-here').addEventListener('mouseenter',e=>{
	sharpen();
});	
document.getElementById('all-projects-here').addEventListener('mouseleave',e=>{
	rounden();
});	

var start = true;



var scrollX = 0;
var scrollY = 0;
var currentPage = 1;
var scrollPage = 1;

var currentSkill = 0;
var ySkill = 0;

function draw() {
	if(start){
		goopP5.createGoop(0.7,2.5,250,'#906b5e');
		goopP5.createGoop(0.2,4.5,250,'#e6ddd4');
		goopP5.createGoop(1.2,5.5,250,'#b8aa8c');
		goopP5.createGoop(0.2,6.5,250,'#93ae88');
		goopP5.createGoop(1,9.5,600,'#93ae88');
		
		
		
		koiP5.allFish.length = 0;
		koiP5.allFish.NumberOfFish = 0;
		for(var i = 0; i<skillsList.length+3; i++){
			koiP5.NumberOfFish++;
			if(i<3){
				var smouse = koiP5.createVector(Math.random()*koiP5.width, Math.random()*koiP5.height);	
				koiP5.createKoi(smouse.x, smouse.y,Math.random()*10+15,smouse);
			}
			else{
				var smouse = koiP5.createVector(goopP5.AllGoops[0].x + koiP5.shift[0], goopP5.AllGoops[0].y + koiP5.shift[1]);	
				koiP5.createKoi(goopP5.AllGoops[0].x, goopP5.AllGoops[0].y,25,smouse);
			}
		}
		start = false;
	}
	pageHeight = window.innerHeight;
	pageWidth = window.innerWidth;
	scrollYPos = window.pageYOffset;
	
	currentPage = Math.floor((scrollYPos/pageHeight)+0.5);
	scrollPage = Math.floor((scrollYPos/pageHeight));
	pageContent.style.left = -scrollX+"px";
	pageContent.style.top = -scrollY+"px";
	bgCircleDiv.style.left = -scrollX/2+"px";
	bgCircleDiv.style.top = -scrollY/2+"px";
	
	koiP5.clear();
	koiP5.noStroke();
	
	if(screen.width>600 && screen.height>600 && pageWidth>600 && pageHeight>600){

		blobsEl.style.top = "0px";
		
		koiP5.shift = [-scrollX/pageWidth*koiP5.width,-scrollY/pageHeight*koiP5.height];

		for(var i = 0; i <koiP5.allFish.length; i++){
			if(i<3){
				koiP5.allFish[i].m.x = koiP5.width * koiP5.noise(frameCount/200 + i * 25);
				koiP5.allFish[i].m.y = koiP5.height * koiP5.noise(frameCount/200+400 + i * 25);
				if(currentPage<2){
					koiP5.allFish[0].m.x = koiP5.mouseX;
					koiP5.allFish[0].m.y = koiP5.mouseY;
				}
				else{
					koiP5.allFish[i].m.x = goopP5.AllGoops[0].x + koiP5.shift[0];
					koiP5.allFish[i].m.y = goopP5.AllGoops[0].y + koiP5.shift[1];
				}
			}
			else{ 
				if(currentSkill>i-4){
					var yshift = goopP5.height*3 + koiP5.shift[1];
					if(yshift<0){
						yshift = 0;
					}
					koiP5.allFish[i].m.y = koiP5.height * koiP5.noise(frameCount/200+400 + i * 25)+yshift;

					if(currentPage>3){
						koiP5.allFish[i].m.x = koiP5.width * koiP5.noise(frameCount/200 + i * 25)+koiP5.shift[0]+koiP5.width/4;
					}
					else{
						koiP5.allFish[i].m.x = koiP5.width * koiP5.noise(frameCount/200 + i * 25);
					}
					if(i-3<(koiP5.allFish.length-3)){
						if(currentPage>5){
							koiP5.allFish[i].m.x = goopP5.AllGoops[3].x + koiP5.shift[0];
							koiP5.allFish[i].m.y = goopP5.AllGoops[3].y + koiP5.shift[1];
						}
					}
					if(i-3<(koiP5.allFish.length-3)*2/3){
						if(currentPage>4){
							koiP5.allFish[i].m.x = goopP5.AllGoops[2].x + koiP5.shift[0];
							koiP5.allFish[i].m.y = goopP5.AllGoops[2].y + koiP5.shift[1];
						}
					}
					if(i-3<(koiP5.allFish.length-3)/3){
						if(currentPage>3){
							koiP5.allFish[i].m.x = goopP5.AllGoops[1].x + koiP5.shift[0];
							koiP5.allFish[i].m.y = goopP5.AllGoops[1].y + koiP5.shift[1];
						}
					}
				}
				else{
					koiP5.allFish[i].m.x = goopP5.AllGoops[0].x + koiP5.shift[0];
					koiP5.allFish[i].m.y = goopP5.AllGoops[0].y + koiP5.shift[1];
				}
				if(currentPage>3){
					koiP5.allFish[i].bL += (15-koiP5.allFish[i].bL)/10;
				}
	//			else{
	//				koiP5.allFish[i].bL += (25-koiP5.allFish[i].bL)/10;
	//			}
			}
			var over = false;
			for(var j = 0; j<goopP5.AllGoops.length; j++){
				if(distance(koiP5.allFish[i].bx[0], koiP5.allFish[i].by[0], goopP5.AllGoops[j].x, goopP5.AllGoops[j].y)< goopP5.AllGoops[j].s/5)
				{
					over = true;
				}
			}
			if(!over)
	//		if(distance(koiP5.allFish[i].bx[0], koiP5.allFish[i].by[0], goopP5.AllGoops[0].x, goopP5.AllGoops[0].y)> goopP5.AllGoops[0].s/5)
			{
				if(currentSkill==i-3){
					koiP5.allFish[i].display('#e38a9b');
				}
				else{
					koiP5.allFish[i].display(100);
				}
			}

			koiP5.allFish[i].move(i);
		}

		goopP5.clear();
		goopP5.AllGoops.forEach(g => {
			g.display();
		})

		if(koiP5.canvas.canvas.style.width != koiP5.windowWidth+"px" || koiP5.canvas.canvas.style.height != koiP5.windowHeight+"px"){
			koiP5.changeSize();
			goopP5.changeSize();
			goopP5.AllGoops.length = 0;
			goopP5.createGoop(0.7,2.5,250,'#906b5e');
			goopP5.createGoop(0.2,4.5,250,'#e6ddd4');
			goopP5.createGoop(1.2,5.5,250,'#b8aa8c');
			goopP5.createGoop(0.2,6.5,250,'#93ae88');
			goopP5.createGoop(1,9.5,600,'#93ae88');
		}

		var w = pageWidth/2;

		if(scrollPage<2){
			var h = Math.PI/(pageHeight);
			scrollX = -w/2*Math.cos(h*scrollYPos)+w/2;
			scrollY = scrollYPos;
			skillsList[0].style.backgroundColor = 'transparent';
			skillsList[0].style.left = '0px';
		}
		if(scrollPage>=2 && scrollPage<4){
			var h = Math.PI/(pageHeight*2);
			scrollX = 0;
			scrollY = scrollYPos;
			ySkill = Math.round((scrollYPos-(2*pageHeight))/80);
			if(ySkill>skillsList.length-1){
				ySkill=skillsList.length;
			}

			currentSkill = ySkill;
			for(var i = 0; i<skillsList.length; i++){

				if(i<=ySkill){
					skillsList[i].style.backgroundColor = 'red';
				}
				else{
					skillsList[i].style.backgroundColor = 'transparent';
				}
				if(i==ySkill){
					skillsList[i].style.left = '100px';
				}
				else{
					skillsList[i].style.left = '0px';
				}
				if(skillsMouse[i]){
					currentSkill = i;
				}

				if(i==currentSkill){
					skillsList[i].style.backgroundColor = '#e38a9b';
				}
			}
		}
		if(scrollPage>3  && scrollPage<7){
			var h = Math.PI/(pageHeight);
			scrollX = -w/2*Math.cos(h*scrollYPos)+w/2;
			scrollY = scrollYPos;
		}
		if(scrollPage>6  && scrollPage<10){
			var h = Math.PI/(pageHeight*2);
			scrollX = w;
			scrollY = scrollYPos;
		}
	}
	else{
//		goopP5.AllGoops[0].x = pageWidth/2;
//		goopP5.AllGoops[0].y = height/2;
//		goopP5.AllGoops[0].s = 1250;
//		goopP5.clear();
//		goopP5.AllGoops.forEach(g => {
//			g.display();
//		})
		bgCircleDiv.style.left = "0px";
		bgCircleDiv.style.top = -scrollYPos/2+"px";
		pageContent.style.left = "0px";
		pageContent.style.top = "0px";
		blobsEl.style.top = -scrollYPos/1.2+"px";
		if(scrollPage>6){
			if(sharp){
				sharpen();
				sharp = false;
			}
		}
		else{
			if(!sharp){
				rounden();
				sharp = true;
			}
		}
	}
	openMenu();
};

var sharp = false;

function sharpen(){
	newCircle.forEach(c => {
		c.style.width = Math.random()*50+20+"px";
		c.style.height = Math.random()*50+20+"px";
	  c.style.transform = 'rotate('+((Math.random()*720)-360)+'deg)';
		c.style.borderRadius = Math.floor(Math.random()*4)*10+"px";
	})
}

function rounden(){
	newCircle.forEach(c => {
		var randomW = Math.random()*50;
		c.style.width = randomW+"px";
		c.style.height = randomW+"px";
	  c.style.transform = 'rotate(0deg)';
		c.style.borderRadius = "500px";
	})
}


function distance(x,y,x1,y1){
	return Math.sqrt(Math.pow(x1-x,2)+Math.pow(y1-y,2));
}

function mod(a,n){
  return ((a % n ) + n ) % n;
}

