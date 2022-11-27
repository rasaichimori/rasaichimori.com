function changeSize(){
	resizeCanvas(1200, 1200*window.innerHeight/window.innerWidth, true);
	p5canvas.canvas.style.width = window.innerWidth+"px";
	p5canvas.canvas.style.height = window.innerHeight+"px";
}
window.addEventListener('resize', changeSize);


c = [];
bump = [];
notes = [];
var o = 0;
var speed = 0.5;
var polySynth;
var p5canvas;
function setup(){
	p5canvas = createCanvas(10,10);
	p5canvas.parent('p5canvas');

	polySynth = new p5.PolySynth();
	reverb = new p5.Reverb();
	delay = new p5.Delay();
	reverb.process(polySynth, 1, 1);
	delay.process(polySynth, 0.2, 0.3, 2300);
	changeSize();
}

function draw() {
		bump = [];
		notes = [];
		background(20);
		c.forEach(cir => {
			cir.check();
		});
		c.forEach(cir => {
			cir.display();
		});
		if(notes.length>0){
			playNote();
		}
		if(c.length>1){
			o += (1-o)/10;
		}
		else{
			o += (0-o)/10;
		}
		document.getElementById("i1").style.opacity = 1-o;
		document.getElementById("i2").style.opacity = o;
		// text(bump,10,10);
}

class circle{
	constructor(x,y,s,id){
		this.x = x;
		this.y = y;
		this.s = s;
		this.dir = speed;
		this.id = id;
	}

	check(){
		for(var i = this.id+1; i<c.length; i++){
				var dis = dist(this.x,this.y,c[i].x,c[i].y);
				var obump = this.s+c[i].s;
				if(dis<obump)
				{
					var big, small;
					if(c[i].s>this.s){
						small = this.s;
						big = c[i].s;
					}
					else{
						small = c[i].s;
						big = this.s;
					}
					if(dis+small>big){
							if(!bump.includes(this.id)){
								this.dir*=-1;
								bump.push(this.id);
							}
							if(!bump.includes(i)){
								c[i].dir*=-1;
								bump.push(i);
							}
							notes.push(big);
							notes.push(small);
					}
				}
		}


		if(this.s<1){
			this.dir=speed;
		}
		if(this.s>400){
			this.dir=-speed;
		}
	}

	display(){
		this.s+=this.dir;
		noFill();
		stroke(204, 178, 33);
		strokeWeight(1);
		ellipse(this.x,this.y,this.s*2);
		// text(this.id,this.x,this.y);
	}
}

function mousePressed(){
	c.push(new circle(mouseX,mouseY,0,c.length));
}

function keyPressed() {
	if (keyCode == 32) {
		c = [];
	}
}

function playNote(){
	userStartAudio();
	for(var i = 0; i<notes.length; i++){
		var n = round(200-constrain(notes[i],5,195));
		var oct = floor(map(n,5,195,2,5));
		var t = n-round(map(oct,2,5,5,195,true));
		var tone;
		if(t<10){
			 tone = "C";
		}
		else if(t<20){
			 tone = "D";
		}
		else if(t<30){
			 tone = "E";
		}
		else if(t<40){
			 tone = "F";
		}
		else if(t<50){
			 tone = "G";
		}
//						else{
//							 tone = "B";
//						}

		var note = tone+oct;
		polySynth.play(note, 0.5, 0, 0.1);
	}
}
