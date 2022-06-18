var koiSketch = function(p){
	p.changeSize = function(){
		p.resizeCanvas(p.CanvasSize, p.CanvasSize*p.windowHeight/p.windowWidth, true);
		p.canvas.canvas.style.width = p.windowWidth+"px";
		p.canvas.canvas.style.height = p.windowHeight+"px";
		
//		p.canvas.canvas.width = 1200;
//		p.canvas.canvas.height = 1200*p.windowHeight/p.windowWidth;
	}
	
	p.CanvasSize = 1200;

	p.allFish = [];
	p.NumberOfFish = 3;
//	p.speed = 15;
	p.speed = 2;
	p.segLength = 5;
	p.shift = [0,0];
	
	
	p.canvas;
	p.setup = function() {
		p.canvas = p.createCanvas(10, 10);
		p.canvas.parent('koi');
		p.changeSize();
		for(var i = 0;i<p.NumberOfFish;i++){
			var randomWidth = Math.random()*p.width;
			var randomHeight = Math.random()*p.height;
			var randomSize = Math.random()*10+15;
			var smouse = p.createVector(randomWidth,randomHeight)
			p.allFish[i] = new koi(randomWidth,randomHeight,randomSize,smouse);
		}
	}
	
	p.createKoi = function(x,y,body,mouse){
		p.allFish.push(new koi(x,y,body,mouse));
	}
	
	class koi{
		constructor(x, y, body, mouse){
			this.id = 0;
			this.bL = body;
			this.m = mouse;
			this.bx = [x];
			this.by = [y];
			this.tx = [0];
			this.ty = [0];
			for (var i = 1; i < body; i++) {
				this.bx.push(0);
				this.by.push(0);
				this.tx.push(0);
				this.ty.push(0);
			}
			this.speed = p.speed;
			this.angle = p.random(0,p.TWO_PI);
			this.ma = 0;
			this.off = 0;
			this.show = false;
		}
		move(id){
			if(this.bL>this.bx.length){
//				for(var i = 0; i<this.bL-this.bx.length; i++){
				this.bx.push(0);
				this.by.push(0);
				this.tx.push(0);
				this.ty.push(0);		
//				}
			}
			this.id = id;
				this.speed+=(p.speed-this.speed)/10;
//				p.ellipse(this.m.x, this.m.y, 10, 10);
			

			var diff = distance(this.m.x-p.shift[0], this.m.y-p.shift[1], this.bx[0], this.by[0]);

			var angle = getAngle(this.bx[0],this.by[0],this.m.x-p.shift[0],this.m.y-p.shift[1]);
			this.ma = angle-this.angle;
			this.ma = mod(this.ma+Math.PI,2*Math.PI)-Math.PI;
			
			this.angle-=(0-this.ma)/(this.bL*2);

			this.bx[0] += this.speed * Math.cos(this.angle);
			this.by[0] += this.speed * Math.sin(this.angle);

		
			for (var i = 1; i < this.bL; i++) {
//				var off = 9*Math.sin(p.radians(this.off));
				var a = getAngle(this.bx[i],this.by[i],this.bx[i - 1],this.by[i-1]);
				var a1 = getAngle(this.bx[i-1],this.by[i-1],this.bx[i-2],this.by[i-2]);


				this.bx[i] = this.bx[i - 1] - Math.cos(a) * (this.bL-i)/3;
				this.by[i] = this.by[i - 1] - Math.sin(a) * (this.bL-i)/3;
			}
//			this.off+=50/this.bL;
			
			
			
//			if((this.bx[0]+p.shift[0])<(p.width+20) && (this.bx[0]+p.shift[0])>-20 && (this.by[0]+p.shift[1])<(p.height+20) && (this.by[0]+p.shift[1])>-20)
			{
				this.show = true;
			}
//			else{
//				this.show = false;
//			}
		}
		
		display(color){
			if(this.show)
			{
				var bL = Math.floor(this.bL)-1;
				
				p.drawBody(this.bx,this.by,bL, color);
				var s = this.bL/1.9;
				var a = this.angle;
				var third = Math.floor(bL);
				p.drawHead(this.bx[0], this.by[0], s, a);
				a = getAngle(this.bx[third], this.by[third],this.bx[third-1], this.by[third-1]);
				p.drawFin(this.bx[third], this.by[third], s*1.3, a);
//				a = getAngle(this.bx[bL], this.by[bL],this.bx[bL - 1], this.by[bL - 1]);
				
				//drawTail(this.bx[bL], this.by[bL], s, a);


				//the other tail method
				this.tx[0] = this.bx[bL];
				this.ty[0] = this.by[bL];

				for(var i = 1; i<bL; i++){
					var angle = getAngle(this.tx[i],this.ty[i],this.tx[i-1],this.ty[i-1]);
					this.tx[i] = this.tx[i-1] - Math.cos(angle) * 2;
					this.ty[i] = this.ty[i-1] - Math.sin(angle) * 2;
					p.ellipse(this.tx[i]+p.shift[0], this.ty[i]+p.shift[1], 2);
				}
				p.speed = 1.5;
			}
		}
	}
	
	p.drawBody = function(x,y,bL, color){
		var s = bL;
		for(var i = 0; i < bL; i++){
				if(i>Math.floor(bL/4)){
					 s-=1;
				}
				p.fill(color);
				p.ellipse(x[i]+p.shift[0], y[i]+p.shift[1], s);
		}
	}
	
	p.drawHead = function(x,y,s,a){
		p.push();
		p.translate(x+p.shift[0],y+p.shift[1]);
		p.rotate(a);
		p.beginShape();
		p.curveVertex(0,s*1);
		p.curveVertex(0,s*-0.75);
		p.curveVertex(s*1.3,s*-0.5);
		p.curveVertex(s*1.7,0);
		p.curveVertex(s*1.3,s*0.5);
		p.curveVertex(0,s*0.75);
		p.curveVertex(0,s*-1);
		p.endShape();
		p.fill(255);
		p.stroke(255);
		p.ellipse(s*1.1,s*0.5,s/9);
		p.ellipse(s*1.1,s*-0.5,s/9);
		p.pop();
	}
	
	p.drawFin = function(x, y, s, a) {
		p.push();
		p.translate(x+p.shift[0],y+p.shift[1]);
		p.rotate(a);
		p.beginShape();
		p.curveVertex(0,0);
		p.curveVertex(s*-1.5,s*1.5);
		p.curveVertex(s*-1.5,s*0.5);
		p.curveVertex(0,0);
		p.curveVertex(s*-1.5,s*-0.5);
		p.curveVertex(s*-1.5,s*-1.5);
		p.curveVertex(0,0);
		p.endShape(CLOSE);
		p.pop();
	}
}







function drawTail(x, y, s, a) {
  push();
  translate(x+shift[0],y+shift[1]);
  rotate(a);
  beginShape();
  curveVertex(0,0);
  curveVertex(s*-2,s);
  curveVertex(s*-4,s*0.5);
  curveVertex(s*-1.5,0);
  curveVertex(s*-5,s*-0.2);
  curveVertex(s*-2,s*-1);
  curveVertex(0,0);
  endShape(CLOSE);
  pop();
}


function getAngle(x, y, mx, my){
  var dx = mx - x;
  var dy = my - y;
  var angle = Math.atan2(dy, dx); 
  return angle;
}


var koiP5 = new p5(koiSketch);