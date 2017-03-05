//	                                               (\_/)
//	  /\_/\                                        (^ç^)
//	w( °u° )                                        ) (
//	|(~~~~~)        /|/|  __   _  `  __  /-/)   ___/(_)\__
//	|(")_(")~>    (/   |_(_/(_( )_|_//(_/_/\_      "w w"
//	                           / 
//	                          (_)
//
// https://github.com/maginth/js-background-generators

var d = document;
var head=d.getElementsByTagName('head')[0],
body=d.getElementsByTagName('body')[0],
create = d.createElement.bind(d),
add = body.appendChild.bind(body);



function BG(ww,hh) {
	var c=create('canvas');
	c.width=ww;
	c.height=hh;
	var g=c.getContext('2d'),im,u,u8,ul,w=ww,h=hh,_x_=0,_y_=0,_data_,_path_,_fill_,rd,j,k,l;
	this.__defineGetter__("canvas",function() {this.fill();return c;});
	this.hack=function(){init(); return {g:g,im:im,u:u}};
	
	this.frame=function(x,y,_w,_h) {
		_x_=x;
		_y_=y;
		w=_w;
		h=_h;
		im=u=u8=null;
	}
	
	var seed=this.seed = function(s) {
		rd=[];
		for (var i=0;i<64;i++) rd[i] = s = (Math.log(s)*1e9)&0x3fffffff;
		j=55;k=0;l=31;
		return this;
	}
	
	function init() {
		if (!rd) seed(Math.random());
		if (!im) im=g.getImageData(_x_,_y_,w,h);
		_data_=true;
		u8=im.data;
		u=new Int32Array(u8.buffer);
		ul=u.length;
	}
	
	this.fill=function() {
		if(_data_) {g.save();if(_path_)g.clip();g.putImageData(im,_x_,_y_);g.restore();};
		if(_fill_) {if(_path_)g.fill();else g.fillRect(_x_,_y_,w,h); }
		g.beginPath();
		this.frame(0,0,c.width,c.height);
		_path_=_fill_=_data_=false;
		return this;
	}
	
	this.noise=function (vr,vg,vb,va) {
		init();
		var r,i=0,a,c=2/255,u8l=u8.length;
		// variable aléatoire X d'écart type v à partir de la somme de X1+X2+..+Xn uniformes sur [0,1]: X=v*sqrt(12/n)*(X1+X2+..+Xn - n/2)
		while (i<u8l) {
			a = rd[j++&63] = (rd[k++&63]+rd[l++&63])&0xffffff;
			r=c*((a&255)+(a>>16)+(a>>8&255)-382.5);
			u8[i++]+=vr*r;
			u8[i++]+=vg*r;
			u8[i++]+=vb*r;
			u8[i++]+=va*r;
		}
		return this;
	}
	
	this.noiseFast=function (vr,vg,vb,va,µr,µv,µb,µa,blim) {
		init();
		var lim = blim ? function(x) {return x < 0 ? 0 : x > 255 ? 255 : Math.round(x)} : Math.round;
		µr=µr||0;µv=µv||0;µb=µb||0;µa=µa||0;
		var i,a=0,w=[],m=128,y=1/m-1,x,c=2/(Math.PI*0.147),b=2/0.147;
		for (i=0;i<m;i++) {
			x=c+Math.log(1-y*y)/2;
			r=(y>0?1:-1)*Math.SQRT2*Math.sqrt(Math.sqrt(x*x-(x-c)*b)-x);
			w[i]=(lim(vr*r+µr)<<0)+(lim(vg*r+µv)<<8)+(lim(vb*r+µb)<<16)+(lim(va*r+µa)<<24);
			y+=2/m;
		}
		var i=ul&0xffffffc;
		while (i--!=0) {
			a = rd[j++&63] = (rd[k++&63]+rd[l++&63])&0xfffffff;
			u[i--]+=w[a>>21];
			u[i--]+=w[a&127];
			u[i--]+=w[(a>>7)&127];
			u[i]+=w[(a>>14)&127];
		}
		return this;
	}
	
	this.erosion = function(levels) {
		var temp=create('canvas'),
		gg=temp.getContext('2d');
		function put(x,y,w,h,px,py) {gg.putImageData(g.getImageData(x,y,w,h),px,py);}
		for (var i=0;i<levels.length;i++) {
			temp.width=w+2;temp.height=h+2;
			put(0,0,1,1,w+1,h+1);
			put(0,0,w,1,1,h+1);
			put(w-1,0,1,1,0,h+1);
			put(0,0,1,h,w+1,1);
			put(0,0,w,h,1,1);
			put(w-1,0,1,h,0,1);
			put(0,h-1,1,1,w+1,0);
			put(1,h-1,w,1,1,0);
			put(w-1,h-1,1,1,0,0);
			w = c.width=2*w; h = c.height=2*h;
			g.scale(2,2);
			g.drawImage(temp,-2,-2);
			var l=levels[i];
			this.noiseFast(l[0],l[1],l[2],l[3],0,0,0,0,true).fill();
		}
		return this;
	}
	
	this.radial= function(x1,y1,r1,x2,y2,r2,arg) {
		_fill_=true;
		var gr=g.createRadialGradient(x1,y1,r1,x2,y2,r2);
		for (var i=0;i<arg.length;i++) gr.addColorStop(arg[i][0],arg[i][1]);
		g.fillStyle = gr;
		return this;
	}
	
	this.linear= function(x1,y1,x2,y2,arg) {
		_fill_=true;
		var gr=g.createLinearGradient(x1,y1,x2,y2);
		for (var i=0;i<arg.length;i++) gr.addColorStop(arg[i][0],arg[i][1]);
		g.fillStyle = gr;
		return this;
	}
	
	this.angular=function(_x0,_y0,rmin,r,arg) {
		init();
		var len=arg.length;
		
		for (var i=0;i<len;i++) {
			var j=(i+1)%len,
			ai=arg[i],aj=arg[j],
			teta1=(ai[0]%1)*2*Math.PI,teta2=(aj[0]%1)*2*Math.PI;
			if (teta1>teta2) teta2+=2*Math.PI;
			var c1=ai[1],c2=aj[1],
			dteta=1/r;
			r1=c1&255,r2=c2&255,
			g1=(c1>>8)&255,g2=(c2>>8)&255,
			b1=(c1>>16)&255,b2=(c2>>16)&255,
			a1=c1>>>24,a2=c2>>>24,
			n=(teta2-teta1)*r,
			vr=(r2-r1)/n,vg=(g2-g1)/n,vb=(b2-b1)/n,va=(a2-a1)/n;
			while(teta1<teta2) {
				c1=((r1+=vr)<<0)+((g1+=vg)<<8)+((b1+=vb)<<16)+((a1+=va)<<24);
				var m,dx=(r*Math.cos(teta1))<<0,dy=(r*Math.sin(teta1))<<0,
				x0_=dx>0?_x0:_x0-1,y0_=dy>0?_y0:_y0-1,
				x=x0_+dx,y=y0_+dy,c=-x0_*dy+y0_*dx,
				x0=(x0_+dx*rmin/r)<<0,y0=(y0_+dy*rmin/r)<<0,
				sx=dx>0?-1:1,sy=dy>0?-1:1;
				teta1+=dteta;
				if (x>=w) {if(x0>=w) continue;x=w-1;y=((w-1-x0)/dx*dy+y0)<<0;}
				if (x<0) {if(x0<0) continue;x=0;y=(-x0/dx*dy+y0)<<0;}
				if (y>=h) {if(y0>=h) continue;x=((h-1-y0)/dy*dx+x0)<<0;y=h-1;}
				if (y<0) {if(y0<0) continue;x=(-y0/dy*dx+x0)<<0;y=0;}
				
				if (dx*dy<0) {dx=-dx;dy=-dy;c=-c;}
				u[x+w*y]=c1;
				if (dx*dx>dy*dy) {
					var lim=x0<0?0:x0>=w?w-1:x0;
					while(x!=lim) {
						if (x*dy-y*dx+c<0) y+=sy;
						else x+=sx;
						u[x+w*y]=c1;
					}
				} else {
					var lim=y0<0?0:y0>=h?h-1:y0;
					while(y!=lim) {
						if (x*dy-y*dx+c>0) x+=sx;
						else y+=sy;
						u[x+w*y]=c1;
					}
				}
			}
		}
		return this;
	}
	
	
	this.spiral=function (x0,y0,rmin,rmax,dr,dteta,levels,right,out,fast) {
		init();
		if(right)dteta=-dteta; if(out) dr=-dr;
		var merge=u[x0+w*y0];
		
		var a=0,i,u1,u2,c1,n,cs,sn,cs2,sn2,_x,x=1,y=0,arc,_s=right?1:-1;
		var _dr=fast?Math.SQRT1_2-0.05:0.8;_dt=fast?Math.SQRT1_2:Math.SQRT2-1;
		var p=0,l=rmax*50; while(l>>p) p++;
		var nse,lvl=levels[0],_nse=new BG(1<<(p-4),16),mask=(1<<p)-1;
		_nse.noiseFast(lvl[0]||1,lvl[1]||1,lvl[2]||1,lvl[3]||1,(lvl[4]||0)+0.5,(lvl[5]||0)+0.5,(lvl[6]||0)+0.5,(lvl[7]||0)+0.5);
		for (i=1;i<levels.length;i++) {
			lvl=levels[i];_nse.noiseFast(lvl[0],lvl[1],lvl[2],lvl[3]);
		}
		nse=_nse.hack().u;
		
		if (!right) y0=h-y0;
		var xw=w-x0, yh=h-y0,xx=x0*x0, xxw=xw*xw, yy=y0*y0, yyh=yh*yh;
		if (!right) y0=h-y0;
		
		for (var _r=rmin;_r<rmax;_r+=_dr) {
			var r=out?_r:rmax+rmin-1-_r, ir=1/r, rr=r*r;
			
			var b1=xxw>rr, b2=xxw+yyh>rr, b3=yyh>rr, b4=yyh+xx>rr, b5=xx>rr, b6=xx+yy>rr, b7=yy>rr, b8=yy+xxw>rr,
			empt={x:r,y:0,teta:0,a:0}, arcs=[empt],i=0;
			
			if (b2){if (!b1) arcs[i]={x:xw,y:Math.sqrt(rr-xxw),teta:Math.acos(xw*ir)};
					if (!b3) arcs[i].a=Math.asin(yh*ir)-arcs[i++].teta;}
			if (b4){if (!b3) arcs[i]={x:-Math.sqrt(rr-yyh),y:yh,teta:Math.PI*0.5+Math.acos(yh*ir)};
					if (!b5) arcs[i].a=Math.asin(x0*ir)+Math.PI*0.5-arcs[i++].teta;}
			if (b6){if (!b5) arcs[i]={x:-x0,y:-Math.sqrt(rr-xx),teta:Math.PI+Math.acos(x0*ir)};
					if (!b7) arcs[i].a=Math.asin(y0*ir)+Math.PI-arcs[i++].teta;}
			if (b8){if (!b7) arcs[i]={x:Math.sqrt(rr-yy),y:-y0,teta:Math.PI*1.5+Math.acos(y0*ir)};
					if (!b1) arcs[i].a=Math.asin(xw*ir)+Math.PI*1.5-arcs[i++].teta;}
			if (arcs[0]==empt) {
				if(b1) {arcs[0].x=arcs[i].x; arcs[0].y=arcs[i].y; arcs[0].a=2*Math.PI-arcs[i].teta+arcs[0].a;
					if (i>0) delete arcs[i];}
				else continue;
			}
			
			cs= Math.cos(_dt*ir);
			sn= _s*Math.sin(_dt*ir);
			cs2=(1+dr*ir)*Math.cos(dteta*ir);
			sn2=(1+dr*ir)*Math.sin(dteta*ir);
			
			while (arc=arcs.shift()) {
				n=(arc.a*r/_dt)<<0;
				x=arc.x;y=_s*arc.y;
				while (n--) {
					_x=cs*x-sn*y;
					y=sn*x+cs*y;
					x=_x;
					u1 = (((x0+x)<<0)+w*((y0+y)<<0));
					c1 = u[u1];
					if (c1!=0) {merge=c1;continue;}
					u2 = (((x0+x*cs2-y*sn2)<<0)+w*((y0+x*sn2+y*cs2)&0x7fffffff))%ul;
					u[u1] = 
					merge = 0xff010101|((merge>>>1&0x7e7f7f7f)+(u[u2]>>>1&0x7e7f7f7f)+nse[a++&mask]);
				}
			}
		}
		return this;
	};
	
	
	this.background=function (el) {
		el.style.background='url('+this.canvas.toDataURL()+')';
		return this;
	}
	
	this.fit=function(el) {
		this.canvas.width=el.offsetWidth;
		this.canvas.height=el.offsetHeight;
		var s=this.canvas.style;
		s.width=s.height='100%';
		s.position='absolute';
		s.zIndex="-1";
		el.style.position='relative';
		el.style.background='';
		s.top=s.left='0px';
		if (el.firstChild) el.insertBefore(this.canvas,el.firstChild);
		else el.appendChild(this.canvas);
		return this;
	}
	
}
