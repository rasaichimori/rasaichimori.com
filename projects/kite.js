const app = new PIXI.Application({ 
    width: 256,         // default: 800
    height: 256,        // default: 600
    antialias: true,    // default: false
    transparent: true, // default: false
    resolution: 1       // default: 1
  }
);

document.body.appendChild(app.view);
app.renderer.view.style.position = "fixed";
app.renderer.autoDensity = true;
app.resizeTo = window;

var l = [];
grass = [];
var needleLength = 10;
var noiseLevel = 100;
var grassSpacing = 7;
var segNumber = 5;

window.addEventListener('resize',CreateGrass);

function CreateGrass(){
	loading = true;
	var n = 0;
  var w = constrain(width, 0, 1500);
	for(var ii = 0; ii<l.length; ii++){
		for(var jj = 0; jj<l[ii].length;jj++){
			app.stage.removeChild(l[ii][jj]);
		}
	}
	l = [];
	grass = [];
		for (var j = 0; j<80; j+= grassSpacing){
			for(var i = (width/2)-(w/2); i<w+((width/2)-(w/2)); i+= grassSpacing){
				var x = i + (random(-3,3));
				var y = j + (random(-3,3))+height*4/5;
				var Slength = needleLength+(random(0,5));
				grass[n] = new blade(x,y,n,Slength);
				l[n] = new Array();
				for(var k = 0; k<segNumber;k++)
				{
					l[n][k] = new PIXI.Graphics();
					
//					var c = rgb2hex([20*k,251-k*30,200]);
					var c = rgb2hex([40*k,200,0]);
					var sweight = 1;
					sweight = (segNumber-k)/2;
					l[n][k].lineStyle({width: sweight, color: c, alpha: 1});
					l[n][k].moveTo(0,0).lineTo(0, Slength);
					app.stage.addChild(l[n][k]);
				}
				n++
			}
		}
	loading = false;
	console.log(l.length)
}

function draw() {
	if(setupDone){
		CreateGrass();
		setupDone = false;
	}
	clear();
  grass.forEach(n => {
      n.calc();
      n.display();
  });
  noStroke();
  text(round(frameRate()),10,10);
	stroke(255,0,0);
	line(mouseX,mouseY,pmouseX,pmouseY);
}

class blade{
  constructor(x,y,id,SegmentLength){
    this.x = x;
    this.y = y;
    this.a = 0;
    this.id = id;
    this.vel = 0;
    this.segs = [];
    this.segLength = SegmentLength;
    this.len = segNumber;
    for(var i = 0; i<this.len; i++){
      this.segs[i] = new seg(i,this.x,this.y,0,this.segLength,id);
    }
  }
  calc(){
    var offset = (noise(frameCount/200,this.x/200,this.y/200)-0.5)*50;
    this.vel += (offset-this.a)/30;
    this.a += (this.vel)/5;
		if(mouseY<this.y && mouseY>this.y-(this.segLength*this.len)){
			if((this.x > mouseX && this.x < pmouseX)||(this.x < mouseX && this.x > pmouseX))
			{
				this.a -= (pmouseX-mouseX)*(this.y-(height*4/5))/50;
			}
		}
    this.vel *= 0.9;
    this.segs[0].a=this.a;
  }
  display(){
    for(var i = 0; i<this.len; i++){
      this.segs[i].move();
    }
  }
}


class seg{
  constructor(id,x,y,a,s,Bid){
    this.id = id;
    this.x = x;
    this.y = y;
    this.a = a;
    this.s = s;
    this.x1 = 0;
    this.y1 = 0;
    this.Bid = Bid;
  }
  move(){
    if(this.id!=0){
      this.x = grass[this.Bid].segs[this.id-1].x1;
      this.y = grass[this.Bid].segs[this.id-1].y1;
      this.a = grass[this.Bid].segs[this.id-1].a*1.1;
			l[this.Bid][this.id].x = this.x;
			l[this.Bid][this.id].y = this.y;
			l[this.Bid][this.id].rotation = this.a*(PI/180);
		}
    this.x1 = this.x+cos(this.a-90) * this.s;
    this.y1 = this.y+sin(this.a-90) * this.s;
  }
}

function rgb2hex(rgb)
{
		var b = rgb.map(function(x){             //For each array element
			x = parseInt(x).toString(16);      //Convert to a base16 string
			return (x.length==1) ? "0"+x : x;  //Add zero if we get only one character
		})
		b = "0x"+b.join("");
		return b;
}

