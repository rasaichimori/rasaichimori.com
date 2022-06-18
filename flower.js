
//var flowerSketch = function(p){
class flower{
	constructor(baseX,baseY,flowerLength,flowerAngle, flowerSize, color){
		this.noiseLevel = 10;
		this.color = color;
		this.awayFromScreen = true;
		
		this.base = createVector(baseX,baseY);
		this.flowerpos = createVector(flowerLength*Math.cos(flowerAngle)+baseX,flowerLength*Math.sin(flowerAngle)+baseX);
		this.flowerLength = flowerLength;
		this.restAngle = flowerAngle;
		this.flowerA = 0;
		this.flowerAs = 0;
		
		this.trueX = [];
		this.trueY = [];
		this.trueL = [];

		this.seedX = [];
		this.seedY = [];
		this.seedA = [];
		this.seedXs = [];
		this.seedYs = [];
		var s = flowerSize;
		var L = 0;
		for(var l = 0.001; l<s; l+= 10){ 
			L++;
			for(var a = 0; a<360; a+= 360/(l/1.5)){
			// for(var a = 0; a<360; a+= 15){
				var d = l/Math.pow(L,0.6)*3;
				this.trueX.push(sin(a)*d);
				this.trueY.push(cos(a)*d);
				this.trueL.push(L);
				this.seedX.push(this.trueX[this.trueX.length-1]+this.flowerpos.x);
				this.seedY.push(this.trueY[this.trueY.length-1]+this.flowerpos.y);
				this.seedA.push(a);
				this.seedXs.push(0);
				this.seedYs.push(0);
			}
		}
	}

	calc(){
		this.flowerpos.x = this.flowerLength*cos(this.flowerA)+this.base.x;
		this.flowerpos.y = this.flowerLength*sin(this.flowerA)+this.base.y;
		if(doIntersect(this.flowerpos, this.base, m, pm)){
			if(this.flowerA<0){
				this.flowerAs += (m.x-pm.x)/50;
			}
			else{
			 	this.flowerAs -= (m.x-pm.x)/50;
			}
		}
		this.flowerAs+=((this.restAngle-this.flowerA)/50-this.flowerAs)/50;
		this.flowerA += this.flowerAs;
	}
	display(){
		strokeWeight(5);
		stroke(this.color,100);
		noFill();
		bezier(this.base.x, this.base.y, this.base.x, this.base.y, this.base.x, ((this.base.y-this.flowerpos.y)/2)+this.flowerpos.y, this.flowerpos.x, this.flowerpos.y);
		noStroke();
		fill(200);
		ellipse(this.flowerpos.x,this.flowerpos.y,30);
		
		for(var i = 0; i<this.trueL.length; i++){
			if(mouseIsPressed||this.awayFromScreen){
				this.seedX[i]+=((this.trueX[i]+this.flowerpos.x)-this.seedX[i])/10;
				this.seedY[i]+=((this.trueY[i]+this.flowerpos.y)-this.seedY[i])/10;
				this.seedXs[i] = 0;
				this.seedYs[i] = 0;
			}
			if(distance(this.seedX[i],this.seedY[i],this.flowerpos.x,this.flowerpos.y)<120){
				this.seedXs[i]=((this.trueX[i]+this.flowerpos.x)-this.seedX[i])/(this.trueL[i]);
				this.seedYs[i]=((this.trueY[i]+this.flowerpos.y)-this.seedY[i])/(this.trueL[i]);
				this.seedA[i] = Math.atan2(this.seedY[i]-this.flowerpos.y,this.seedX[i]-this.flowerpos.x);
			}
			else{
				this.seedXs[i]*=0.99;
				this.seedYs[i]*=0.99;
			}
			this.seedXs[i]+=0.2;
			this.seedYs[i]+=-0.1;
			this.seedX[i]+=this.seedXs[i];
			this.seedY[i]+=this.seedYs[i];
			
			if(!this.awayFromScreen){
				var noiseX = (noise(this.trueL[i],i)-0.5)*this.noiseLevel;
				var noiseY = (noise(i,this.trueL[i])-0.5)*this.noiseLevel;
				drawSeed(this.seedX[i]+noiseX,this.seedY[i]+noiseY,10,this.seedA[i]+(noise(i,this.trueL[i])-0.5)*10,this.color);
			}
		}
	}
}


	function drawSeed(x,y,s,a,c){
		stroke(c,100);
		strokeWeight(5);
		point(x,y);
//		 strokeWeight(1);
//		 stroke(c,105);
//		 push();
//		 translate(x,y);
//		 rotate(a);
//		 line(0,0,s*1.5,0);
//		 line(s*1.5,0,s*2,s);
//		 line(s*1.5,0,s*2,-s);
//		 line(s*1.5,0,s*2,-s/2);
//		 line(s*1.5,0,s*2,s/2);
//		 pop();
	}
//}





function onSegment(p, q, r)
{
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
    return true;
   
    return false;
}
 
function orientation(p, q, r)
{
    let val = (q.y - p.y) * (r.x - q.x) -
            (q.x - p.x) * (r.y - q.y);
   
    if (val == 0) return 0; // collinear
   
    return (val > 0)? 1: 2; // clock or counterclock wise
}
 
function doIntersect(p1, q1, p2, q2)
{
    let o1 = orientation(p1, q1, p2);
    let o2 = orientation(p1, q1, q2);
    let o3 = orientation(p2, q2, p1);
    let o4 = orientation(p2, q2, q1);
  
    if (o1 != o2 && o3 != o4){
      return true;
    }
    else{
      return false;
    }
}


//var flowerP5 = new p5(flowerSketch);