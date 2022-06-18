var goopSketch = function(p){
	p.changeSize = function(){
		p.resizeCanvas(p.CanvasSize, p.CanvasSize*p.windowHeight/p.windowWidth, true);
		p.canvas.canvas.style.width = p.windowWidth+"px";
		p.canvas.canvas.style.height = p.windowHeight+"px";
		
		
//		goopP5.AllGoops[0] = new goop(p.width*0.7,p.height*2.5,250,'#906b5e',0);
//		goopP5.AllGoops[1] = new goop(p.width*0.2,p.height*4.5,250,'#e6ddd4',1);
//		goopP5.AllGoops[2] = new goop(p.width*1.2,p.height*5.5,250,'#b8aa8c',2);
//		goopP5.AllGoops[3] = new goop(p.width*0.2,p.height*6.5,250,'#93ae88',3);
//		goopP5.AllGoops[4] = new goop(p.width,p.height*9.5,600,'#93ae88',4);
		
	}
	
	p.CanvasSize = 1200;

	p.AllGoops = [];
	p.canvas;
	
	p.setup = function() {
		p.canvas = p.createCanvas(10, 10);
		p.canvas.parent('goop');
		
		p.changeSize();
	}
	
	p.createGoop = function(x,y,size,color){
		p.AllGoops.push(new goop(p.width*x,p.height*y,size,color,p.AllGoops.length));
	}

	class liqParticle{
		constructor(angle,liqheight,globalx,globaly,id, globalID){
			this.a = angle;
			this.h = liqheight;
			this.hs = 0;
			this.gx = globalx;
			this.gy = globaly;
			this.gID = globalID;
			this.id = id;
			this.gl = this.h;
			this.x = 0;
			this.y = 0;
		}
		move(){
			this.h += this.hs;
			this.hs*=0.9;

			var l = this.gl;
			var r = this.gl;
			if(this.id<1){
				l = p.AllGoops[this.gID].LP[p.AllGoops[this.gID].LP.length-1].h;
			}
			else{
				l = p.AllGoops[this.gID].LP[this.id-1].h;
			}
			if(this.id>p.AllGoops[this.gID].LP.length-2){
				r = p.AllGoops[this.gID].LP[0].h;
			}
			else{
				r = p.AllGoops[this.gID].LP[this.id+1].h
			}
			this.hs += ((l+r)/2-this.h)/10;
			this.hs += (this.gl-this.h)/60;
			this.x = this.h*Math.cos(this.a)+this.gx;
			this.y = this.h*Math.sin(this.a)+this.gy;
			if(distance(this.x,this.y,p.mouseX,p.mouseY)<this.gl/4)
			{
				this.hs += (distance(this.gx, this.gy, p.mouseX, p.mouseY)-this.h)/10;
			}
		}
	}
	
	
	class goop{
		constructor(x,y,s,color,id){
			this.x = x;
			this.y = y;
			this.s = s;
			this.color = color;
			this.LP = [];
			this.segLength = p.radians(20);
			this.id = id;
			for(var i = 0; i<p.radians(359); i+=this.segLength){
				this.LP[Math.round(i/this.segLength)] = new liqParticle(i,250,this.x,this.y,Math.round(i/this.segLength),this.id);
			}
		}
		display(){
			p.fill(this.color);
//			p.fill(10,100);
			p.noStroke();
			p.beginShape();
			p.curveVertex(this.LP[this.LP.length-1].x,this.LP[this.LP.length-1].y);
			this.LP.forEach(dot => {
				dot.gx = this.x+koiP5.shift[0];
				dot.gy = this.y+koiP5.shift[1];
				dot.gl = this.s;
				dot.move();
				p.curveVertex(dot.x,dot.y);
				
				for(var i = 0; i<koiP5.allFish.length; i++){
					var fishX = koiP5.allFish[i].bx[0]+koiP5.shift[0];
					var fishY = koiP5.allFish[i].by[0]+koiP5.shift[1];
					var LPX = dot.x;
					var LPY = dot.y;
					if(distance(LPX,LPY,fishX,fishY)<this.s/5)
					{
						dot.hs += (distance(this.x+koiP5.shift[0],this.y+koiP5.shift[1], fishX, fishY)-dot.h)/10;
					}
				}
			});
			p.curveVertex(this.LP[0].x,this.LP[0].y);
			p.curveVertex(this.LP[1].x,this.LP[1].y);
			p.endShape();
		}
	}
}

var goopP5 = new p5(goopSketch);