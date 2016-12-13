Background Generators –  javascript client side background generators
==============

***Fast hight quality backround generation. No data, just js, save your network bandwidth !***

*(those are preview see the live demos below)*  
![spiral](http://aekuo.com/mathieu/bg/spiral.jpg "Spiral")  
![erosion](http://aekuo.com/mathieu/bg/erosion.jpg "erosion")  
![noise_angular](http://aekuo.com/mathieu/bg/noise_angular.jpg "noise + angular")  


## LIVE DEMOs

generated images are random, refresh the demo page to see more !

1. [Spiral Art](http://aekuo.com/mathieu/bg/testSpiralArt.html)

2. [Erosion noise](http://aekuo.com/mathieu/bg/testErosionNoise.html)

3. [Simple noise](http://aekuo.com/mathieu/bg/testNoise.html)

4. [Angular Gradient](http://aekuo.com/mathieu/bg/testAngularGradiant.html)


## API (Yeah, I know, it need some polish)

### Create a background generator :

	new BG(w, h)
	
w : width  
h : height  

### If you want an identical output on each loading, set the seed :

	seed(s)

s : the chosen seed number

### fill() Should be called at least once just before retreiving the canvas :

	fill()
	
### Generate a normal distributed noise :

	noiseFast(vr, vg, vb, va, µr, µv, µb, µa, blim)
	
v`x` : standard deviation of the `x` color component  
µ`x` : mean of the `x` color component  
blim : true to forbide color overflow (limit the components to 0-255)  

### Generate a noisy cloud with different color variation on each resolution level :

	erosion(levels)
	
levels : array of color variation for each level [[red1, green1, blue1, alpha1], [red2, green2, blue2, alpha2], ... ]
each level double the canvas size, so init BG with a small size, typically : new BG(2, 2)
***Note*** : the image result can be looped, there will be no visible borders
if you find the looped background too repetitive, init BG with a slightly larger size and use fewer erosion levels

### Generate a classic radial gradient (native api) :

	radial(x1, y1, r1, x2, y2, r2, arg)

arg : specify a color stop list instead of using .addColorStop from native API
example [[0, 'red'], [1, 'green']]

### Generate a classic linear gradient (native api) :

	linear(x1, y1, x2, y2, arg)

arg : same as radial gradient

### Generate an angular gradient :

	angular(x0, y0, rmin, r, arg)

arg : /!\ same as linear and radial but color are int instead of string
example [[0, 0xffff0000], [1, 0xff00ff00]] /* hexadecimal 0xAARRGGBB */
	
### Generate a colorfull artistic spiral with progressive color mixing (see example) :

	spiral(x0, y0, rmin, rmax, dr, dteta, levels, right, out, fast)

x0 : x center coordinate  
y0 : y center coordinate  
rmin : starting raduis from the center (0 for a full disk)  
rmax : ending raduis from the center  
dr : mix with the pixel at dr distance from the center (typically 1)   
dteta : and dteta form the side (typically between -2 and 2)  
levels : an array of color noise defined by their variances [vr,vg,vb,va]  
right : direction of spiral rotation  
out : direction of filling (true : from the center to the outside, false otherwise)  
fast : true or false, may affect the spiral shape quality  

### Apply the canvas as a looped background to the element :

	background(el)

el : DOM element

### fit the canvas size to the element :

	fit(el)

el : DOM element

### get an object containing usefull tools for advenced image processing :

 	hack()

return {  
g: the drawing context,  
im: the uint8Array of the pixels components,  
u: the uint32Array of the pixels  
}

## Further documentation

Ask me !