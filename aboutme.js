var scrollYPos = 0;

var pageContent = document.getElementById('pageContent');
var blobsEl = document.getElementById('blobs');



var timeline = document.getElementById('timeline');
var timelineTextDiv = document.getElementById('timelineTextDiv');
var timelineText = document.getElementById('timelineText');
var timelineImgDiv = document.getElementById('image-div');
var timelineImages = document.querySelectorAll('.TLimage');
var timelineBlobs = document.getElementById('timelineBlobs');

var negative = document.getElementById('negative');

var PTLevent = 0;
var TLTwidth = 0;

var scrollX = 0;
var scrollY = 0;
var currentPage = 1;
var scrollPage = 1;


function draw() {
//function drawLoop() {
	pageHeight = window.innerHeight;
	pageWidth = window.innerWidth;
//	scrollYPos += (window.pageYOffset-scrollYPos)/10;
	scrollYPos = window.pageYOffset;
	
	currentPage = Math.floor((scrollYPos/pageHeight)+0.5);
	scrollPage = Math.floor((scrollYPos/pageHeight));
		
	if(screen.width>600 && screen.height>600 && pageWidth>600 && pageHeight>600){
		pageContent.style.left = -scrollX+"px";
		pageContent.style.top = -scrollY+"px";
		
		
		koiP5.clear();
		koiP5.noStroke();

		koiP5.mshift = [0,0];
		koiP5.shift = [-scrollX/pageWidth*koiP5.width/2,-scrollY/pageHeight*koiP5.height/2];

		koiP5.NumberOfFish = 1;
		koiP5.allFish.length = 1;
		koiP5.allFish[0].display(100);
		if(!koiP5.allFish[0].show){
			koiP5.allFish[0].speed = 15;
		}
		koiP5.allFish[0].move(0);
		
		
		if(scrollPage<3){
			var w = pageWidth/2;
			var h = Math.PI/(pageHeight*2);
			scrollX = w*Math.cos(h*scrollYPos)-w;
			scrollY = scrollYPos;
		}


		if(scrollPage==3){
			scrollX = (scrollYPos-(4*pageHeight))/pageHeight*pageWidth/2;
			scrollY = scrollYPos;
		}

		if(scrollPage>2 && scrollPage<18){

			var TLleft = ((scrollYPos-(4*pageHeight))/pageHeight*pageWidth/2)*(1200/pageWidth);
			var TLevent = Math.round((TLleft+810)/810);
			var TLCurrent = Math.round((TLleft+405)/810);
			if(TLleft<timeline.offsetWidth-600){
				timeline.style.transform = "translateX("+(-TLleft-200)+ "px)";
				timelineBlobs.style.transform = "translateX("+(-TLleft/2-200)+ "px)";

				if(PTLevent!=TLevent){
					timelineTextDiv.style.width = "px";
					TLTwidth = 0;
					if(TLevent == 1){
						locName = "Fukuoka";
						locRotation = 2.4;
						timelineText.innerHTML = "I was born in a city in Japan called Fukuoka. I have been back many times to visit my extended family. Its a great place! For the food alone, 10/10 would recommend.";
					}
					if(TLevent == 2){
						locName = "Edinburgh";
						locRotation = 4.7;
						timelineText.innerHTML = "Then we moved to Edinburgh! I don't remember much, but my parents did love it here. Apparently, I was given money by complete strangers all the time!  (I wish that still happened)<br><br>My parents' schooling and work will take us all over the place as you'll see...";
					}
					if(TLevent == 3){
						locName = "Singapore";
						locRotation = 2.5;
						timelineText.innerHTML = "My primary school years were spent in Singapore. The education system is super strict, but I'm glad I had that experience. I never had outstanding grades compared to my peers here but...";
					}
					if(TLevent == 4){
						locName = "Utah";
						locRotation = 0.2;
						timelineText.innerHTML = "After moving to America, I was acing every test! The school was actually starting to become fun! <br><br>I was (and still am) what is known as a nerd.🙂";
					}
					if(TLevent == 5){
						locName = "Utah";
						locRotation = 0.2;
						timelineText.innerHTML = "I entered my first robotics compeition called the First® Lego League at 12 years old, and man, it was fun. I was working with a team of my friends and we placed 4th place in the regional competition.<br><br>Not much, but we were overjoyed!";
					}
					if(TLevent == 6){
						locName = "Utah";
						locRotation = 0.2;
						timelineText.innerHTML = "The following year, we worked hard and knocked it out of the park! We moved past regionals, and had the highest score in the entire state!<br><br> Teamwork, baby!";
					}
					if(TLevent == 7){
						locName = "Tokyo";
						locRotation = 2.2;
						timelineText.innerHTML = "Back to the motherland. (literally)<br><br> I finished all of Highschool in Japan and ...";
					}
					if(TLevent == 8){
						locName = "Utah";
						locRotation = 0.2;
						timelineText.innerHTML = "I graduated at highschool 16.  And to be completely honest, I wish didn't rush so much. Sixteen is a little to early to be living alone. After a year, I felt I needed a break.";
					}
					if(TLevent == 9){
						locName = "Sendai";
						locRotation = 2.2;
						timelineText.innerHTML = "I decided a wanted to go on a two year volunteer service opportunity for my church. I went to the Tohoku area, a place I'd never been before. It was the most fun I've ever had in my life. I met so many wonderful people.";
					}
					if(TLevent == 10){
						locName = "Utah";
						locRotation = 0.2;
						timelineText.innerHTML = "I returned back to BYU where I currently study today! So that's me. Thanks for enduring this long winded intro!<br><br><br><br><span style='opacity: 0.5'>keep scrolling...</span>";
					}
					PTLevent = TLevent;
				}
				if(Math.abs(TLleft-((TLevent-1)*810))<200){

					timelineImages.forEach(image => {
						image.style.width = '400px';
						image.style.height = '400px';
					});
				}
				else{
					timelineImages.forEach(image => {
						image.style.width = '200px';
						image.style.height = '200px';
					});
				}
			}
			else{
				timeline.style.transform = "translateX("+(-timeline.offsetWidth+400)+ "px)";
				timelineBlobs.style.transform = "translateX("+(-timeline.offsetWidth/2+100)+ "px)";

			}
			timelineImgDiv.style.left = (-TLleft/2)+"px";
			TLTwidth += (400-TLTwidth)/10;
			timelineTextDiv.style.width = TLTwidth+"px";
			timelineText.style.opacity = TLTwidth/400;		


			globeShow(TLleft,TLCurrent);
		}

		if(scrollPage>3 && scrollPage<17){
			scrollX = 0;
			scrollY = 4*pageHeight;
			koiP5.allFish[0].m.x = koiP5.width/2;
			koiP5.allFish[0].m.y = koiP5.height*0.7;
		}
		else{
			koiP5.allFish[0].m.x = koiP5.mouseX;
			koiP5.allFish[0].m.y = koiP5.mouseY;
		}
		if(scrollPage>16){
			scrollX = 0;
			scrollY = scrollYPos-(pageHeight*13);
		}
	//	requestAnimationFrame(drawLoop);
		if(currentPage == 18){
			var spacing =  (scrollYPos-(pageHeight*currentPage))/pageHeight;
			negative.style.letterSpacing = spacing*10+5+"px";
			negative.style.opacity = 1-spacing;
		}
	}
	else{
		pageContent.style.left = "0px";
		pageContent.style.top = "0px";
		blobsEl.style.top = -scrollYPos/1.2+"px";
	}
	openMenu();
};
//drawLoop();
	
var offendedEL = document.getElementById("offended");

function skipTL(destination){
	if(destination=="top"){
		window.scrollTo(0,0);
	}
	if(destination=="timeline"){
		if(screen.width>600 && screen.height>600 && pageWidth>600 && pageHeight>600){
			window.scrollTo(pageWidth,pageHeight*4);
		}
		else{
			window.scrollTo(0,1300);
		}
	}
	if(destination=="interests"){
		if(screen.width>600 && screen.height>600 && pageWidth>600 && pageHeight>600){
			window.scrollTo(pageWidth,pageHeight*18);
		}
		else{
			window.scrollTo(0,2000);
		}
	}
}





function distance(x,y,x1,y1){
	return Math.sqrt(Math.pow(x1-x,2)+Math.pow(y1-y,2));
}

function mod(a,n){
  return ((a % n ) + n ) % n;
}

