var globeLB = document.getElementById("globe");
var aspect = globeLB.offsetWidth / globeLB.offsetHeight;
var scene = new THREE.Scene();

var gcamera = new THREE.PerspectiveCamera( 23, aspect, 0.1, 1000 );


var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: globeLB});
renderer.setSize( globeLB.offsetWidth, globeLB.offsetHeight );
renderer.setPixelRatio(window.devicePixelRatio);


var dragX;
var dragY;
var ma = 0;


	
	
	
function globeGroup(s){
	this.mesh = new THREE.Group();
	
	var globeG = new THREE.SphereGeometry(s, 32, 32);
	var globeT = new THREE.TextureLoader().load('images/timeline/map.png');
	var globeM = new THREE.MeshPhongMaterial({
		map: globeT, 
//		side: THREE.DoubleSide, 
		side: THREE.FrontSide, 
		depthWrite: false, 
		transparent: true
	});
	var globe = new THREE.Mesh(globeG, globeM);
	this.mesh.add(globe);
	
	
	var arcG1 = new THREE.TorusGeometry( 0, 0, 4, 4, 0);
//	var arcM1 = new THREE.MeshBasicMaterial( { color: 0xffffff } );
//	var arc1 = new THREE.Mesh( arcG1, arcM1 );
	var arcM = new THREE.MeshBasicMaterial( { color: 0xc88669 } );
	var arc1 = new THREE.Mesh( arcG1, arcM );
	arc1.rotation.x = (-64/360)*Math.PI*2;
	arc1.rotation.y = (155.4/360)*Math.PI*2;
	arc1.rotation.z = (11.2/360)*Math.PI*2;
	
	arc1.position.x = s*0.068;
	arc1.position.y = s*0.653;
	arc1.position.z = s*-0.39;
	this.mesh.add(arc1);
	
	
	var arcG2 = new THREE.TorusGeometry( 0, 0, 4, 4, 0);
//	var arcM2 = new THREE.MeshBasicMaterial( { color: 0xffffff } );
//	var arc2 = new THREE.Mesh( arcG2, arcM2 );
	var arc2 = new THREE.Mesh( arcG2, arcM );
	arc2.rotation.x = (83/360)*Math.PI*2;
	arc2.rotation.y = (-49.4/360)*Math.PI*2;
	arc2.rotation.z = (144.2/360)*Math.PI*2;
	
	arc2.position.x = s*-0.46;
	arc2.position.y = s*0.201;
	arc2.position.z = s*-0.787;
	this.mesh.add(arc2);
		
	
	var arcG3 = new THREE.TorusGeometry( 0, 0, 4, 4, 0);
//	var arcM3 = new THREE.MeshBasicMaterial( { color: 0xffffff } );
//	var arc3 = new THREE.Mesh( arcG3, arcM3 );
	var arc3 = new THREE.Mesh( arcG3, arcM );
	arc3.rotation.x = (-110.8/360)*Math.PI*2;
	arc3.rotation.y = (0/360)*Math.PI*2;
	arc3.rotation.z = (80.8/360)*Math.PI*2;
	
	arc3.position.x = s*-0.399;
	arc3.position.y = s*0.243;
	arc3.position.z = s*-0.119;
	this.mesh.add(arc3);		
	
	
	var arcG4 = new THREE.TorusGeometry( 0, 0, 4, 4, 0);
//	var arcM4 = new THREE.MeshBasicMaterial( { color: 0xffffff } );
//	var arc4 = new THREE.Mesh( arcG4, arcM4 );
	var arc4 = new THREE.Mesh( arcG4, arcM );
	arc4.rotation.x = (-98.2/360)*Math.PI*2;
	arc4.rotation.y = (-167/360)*Math.PI*2;
	arc4.rotation.z = (-83.6/360)*Math.PI*2;
	
	arc4.position.x = s*-0.182;
	arc4.position.y = s*0.441;
	arc4.position.z = s*-0.005;
	this.mesh.add(arc4);
	
	
	var locG = new THREE.PlaneGeometry( s*0.23, s*0.3, 1, 1);
	var locT = new THREE.TextureLoader().load('images/timeline/location.png');
	var locM = new THREE.MeshPhongMaterial({
		map: locT, 
		side: THREE.DoubleSide, 
		depthWrite: false, 
		transparent: true
	});
	var loc = new THREE.Mesh( locG, locM );
	this.mesh.add(loc);
	
}


var earth;
var s = 10;
var createGlobe = () =>{
	earth = new globeGroup(s);
	earth.mesh.scale.set(1,1,1); 
	scene.add(earth.mesh);
}

var ambLight = new THREE.AmbientLight(0xffffff);
scene.add(ambLight);

gcamera.position.z = 70;

var locName = "";
var locRotation = 0;

createGlobe();
//drawLoop();





function globeShow(TLleft,TLCurrent){
	if(window.innerWidth>1000){
		renderer.render( scene, gcamera );
		if(Gdragging){

			locRotation = dragX+(GmouseX-DmouseX)/20;
			earth.mesh.rotation.y = locRotation;
			earth.mesh.rotation.x = dragY+(GmouseY-DmouseY)/20;
		}
		else{
			dragX = earth.mesh.rotation.y;
			dragY = earth.mesh.rotation.x;

			earth.mesh.rotation.x += (0.3-earth.mesh.rotation.x)/50;

			locRotation+= 0.003;
			earth.mesh.rotation.y-=(0-ma)/10;
		}
		ma = locRotation-earth.mesh.rotation.y;
		ma = mod(ma+Math.PI,Math.PI*2)-Math.PI;

		//for the travel semicircle arcs
		if(TLleft>0 && TLCurrent<8){
			var flightPer = (TLleft-(810*(TLCurrent-1)))/810;

			if(TLCurrent < 1){
				earth.mesh.children[1].geometry = new THREE.TorusGeometry( 1, 1, 4, 4, 0);
			}
			else{
				if(TLCurrent > 1){
					earth.mesh.children[1].geometry = new THREE.TorusGeometry( s*0.74, s*0.02, 3, 20, (197.2/360)*Math.PI*2);
				}
				else{
					earth.mesh.children[1].geometry = new THREE.TorusGeometry( s*0.74, s*0.02, 3, 20, (197.2/360)*Math.PI*2*flightPer);
				}
			}

			if(TLCurrent < 2){
				earth.mesh.children[2].geometry = new THREE.TorusGeometry( 1, 1, 4, 4, 0);
			}
			else{
				if(TLCurrent > 2){
					earth.mesh.children[2].geometry = new THREE.TorusGeometry( s*0.38, s*0.02, 3, 20, (184/360)*Math.PI*2);
				}
				else{
					earth.mesh.children[2].geometry = new THREE.TorusGeometry( s*0.38, s*0.02, 3, 20, (184/360)*Math.PI*2*flightPer);
				}
			}			

			if(TLCurrent < 3){
				earth.mesh.children[3].geometry = new THREE.TorusGeometry( 1, 1, 4, 4, 0);
			}
			else{
				if(TLCurrent > 3){
					earth.mesh.children[3].geometry = new THREE.TorusGeometry( s*0.91, s*0.02, 3, 20, (192/360)*Math.PI*2);
				}
				else{
					earth.mesh.children[3].geometry = new THREE.TorusGeometry( s*0.91, s*0.02, 3, 20, (192/360)*Math.PI*2*flightPer);
				}
			}

			if(TLCurrent < 6){
				earth.mesh.children[4].geometry = new THREE.TorusGeometry( 1, 1, 4, 4, 0);
			}
			else{
				if(TLCurrent > 6){
					earth.mesh.children[4].geometry = new THREE.TorusGeometry( s*0.76, s*0.02, 3, 20, (132/360)*Math.PI*2);
				}
				else{
					earth.mesh.children[4].geometry = new THREE.TorusGeometry( s*0.76, s*0.02, 3, 20, (132/360)*Math.PI*2*flightPer);
				}
			}
		}

		//for the location icon to show where it's located in the globe
		{
			earth.mesh.children[5].rotation.y += 0.05;

			if(locName == "Fukuoka"){
				earth.mesh.children[5].position.x = s*-0.612;
				earth.mesh.children[5].position.y = s*0.573;
				earth.mesh.children[5].position.z = s*-0.672;
			}
			if(locName == "Edinburgh"){
				earth.mesh.children[5].position.x = s*0.67;
				earth.mesh.children[5].position.y = s*0.885;
				earth.mesh.children[5].position.z = s*0.051;
			}
			if(locName == "Singapore"){
				earth.mesh.children[5].position.x = s*-0.245;
				earth.mesh.children[5].position.y = s*0.055;
				earth.mesh.children[5].position.z = s*-0.969;
			}
			if(locName == "Utah"){
				earth.mesh.children[5].position.x = s*-0.302;
				earth.mesh.children[5].position.y = s*0.704;
				earth.mesh.children[5].position.z = s*0.754;
			}
			if(locName == "Tokyo"){
				earth.mesh.children[5].position.x = s*-0.688;
				earth.mesh.children[5].position.y = s*0.604;
				earth.mesh.children[5].position.z = s*-0.591;
			}
			if(locName == "Sendai"){
				earth.mesh.children[5].position.x = s*-0.663;
				earth.mesh.children[5].position.y = s*0.653;
				earth.mesh.children[5].position.z = s*-0.546;
			}
		}
	}
}



var GmouseX = 0;
var GmouseY = 0;
var DmouseX = 0;
var DmouseY = 0;
globeLB.addEventListener('mousemove', (e)=>{
	var offsets = globeLB.getBoundingClientRect();
//  event.preventDefault();
	GmouseX = e.clientX-offsets.left-(globeLB.offsetWidth/2);
	GmouseY = e.clientY-offsets.top-(globeLB.offsetHeight/2);
	if(!Gdragging){
		DmouseX = e.clientX-offsets.left-(globeLB.offsetWidth/2);
		DmouseY = e.clientY-offsets.top-(globeLB.offsetHeight/2);
	}
	if(distance(GmouseX,GmouseY,0,0)<s*14.3 && !Gdragging){
		globeLB.style.cursor = "grab";
	}
	else{
		if(!Gdragging){
			globeLB.style.cursor = "auto";
		}
	}
});

var Gdragging = false;
document.addEventListener('mousedown', (e)=>{
	if(distance(GmouseX,GmouseY,0,0)<s*14.3){
//  	e.preventDefault();
		Gdragging = true;
	}
	if(Gdragging){
		globeLB.style.cursor = "grabbing";
	}
});

document.addEventListener('mouseup', (e)=>{
	Gdragging = false;
	if(distance(GmouseX,GmouseY,0,0)<s*14.3 && !Gdragging){
		globeLB.style.cursor = "grab";
	}
	else{
		globeLB.style.cursor = "auto";
	}
});

function globeReset(){
	globeLB = document.getElementById("globe");
	globeLB.width = '800px';
	globeLB.height = '800px';
	globeLB.style.width = '400px';
	globeLB.style.height = '400px';
	aspect = globeLB.offsetWidth / globeLB.offsetHeight;
	scene = new THREE.Scene();

	gcamera = new THREE.PerspectiveCamera( 23, aspect, 0.1, 1000 );


	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: globeLB});
	renderer.setSize( globeLB.offsetWidth, globeLB.offsetHeight );
	renderer.setPixelRatio(window.devicePixelRatio);
	s = 10;
	ambLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambLight);

	gcamera.position.z = 70;

	locName = "";
	locRotation = 0;
	createGlobe();
	GmouseX = 0;
	GmouseY = 0;
	DmouseX = 0;
	DmouseY = 0;
}