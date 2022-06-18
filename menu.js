var menu = document.getElementById('menu');
var menuDiv = document.getElementById('menuDiv');
var open = false;
var touchX;
var touchY;
menuDiv.style.opacity="0";
function openMenu(){
	if(screen.width>600 && screen.height>600){
		if(open){
			if(mouseX>window.innerWidth/6){
				menu.style.transform="rotate(2deg) translate(-90%,-5%)";
				menuDiv.style.opacity="0";
				open = false;
			}
			else{

			}
		}
		else{
			if(mouseX<window.innerWidth/15){
				menu.style.transform="rotate(5deg) translate(-30%,-5%)";
				menuDiv.style.opacity="1";
				open = true;
			}
		}
	}
	else{
		if(docClicked){
			if(menuClicked){
				menu.style.transform="rotate(5deg) translate(-30%,-5%)";
				menuDiv.style.opacity="1";
				menu.style.top="-30vh";
				menuDiv.style.pointerEvents="auto";
				open = true;
			}
			else{
				menu.style.transform="translate(-200%,-20%) rotate(45deg)";
				menuDiv.style.opacity="0";
				menu.style.top="-10vh";
				menuDiv.style.pointerEvents="none";
				open = false;
			}
			docClicked = false;
			menuClicked = false;
		}
	}
}
var menuClicked = false;
menu.addEventListener("touchstart",e=>{
	menuClicked = true;
	
});
var docClicked = false;
document.addEventListener("touchstart",e=>{
	docClicked = true;
});
