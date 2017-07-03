# XST
simple library for 2d game canvas

winScreen(width, height, fullscreen)
opens a canvas with the width, height and in fullscreen = 1 or 0

example:
	winScreen(640, 480, 0)
if no width or height provided,
	winScreen()-> the default would be 640 to 480 no fullscreen. 

setFont(size, name)
sets a font to the size and name given

getFont()
gets the font

example:
	setFont(28, 'Algerian')
	var font = getFont();

function main() {}
	this function must be allways present at the code even if not used, in case of a loop use the code inside this function.

example:
	function main() {
		drawtext("mouse X: "+ getmousex, 10, 20);
	}

drawText(text, x, y)
writes text to the screen at a gifven x and y coords

example:
	drawText("Screen X: "+ screenWidth(), 10, 20);

clear(rgb()); (color is only used when we need alpha or soemthing)
clears the screen, most used in main loop

circle(x, y, radius, bordercolor);
buils a circle in x, y with a radius and a border color 

example:
	circle(100, 100, 10, rgb(0,255,0));

fillCircle(x, y, radius, bordercolor, fillcolor)
the same as above but filled

example:
	fillCircle(150, 100, 60, rgb(0,255,0));

line(x1, y1, x2, y2, linewidth, color)
rect(linewidth, bordercolor, x, y, width, height)
fillRect(x, y, width, height, color)
rgb(r, g, b)
setColor(color)->in rgb() format
setBackColor(rgb(0,0,0)) -> sets the backcolor of canvas
loadTexture(path)->path to image

example:
	var player = loadTexture("images/player.png");

drawTexture(img, x, y)
	
example:
	drawTexture(player, 100, 200)

getMouseX()
getMouseY()
getKey()
getImageWidth(image)
getImageHeight(image)
getScreenHeight()
getScreenWidth()
Entitie(type, image, x, y)

How to use entities:
Example of a player like above but registered as entitie.

example:
	var player = new Entitie('player', 'images/player.png', 100, 100);
	var enemie = new Entitie('enemie', 'images/enemoie.png', 0, 0)

drawTexture(player.image, player.x, player.y)

keys: (MOST IMPORTANT)
	BACKSPACE
     TAB
     ENTER
     PAUSE
     CAPS
     ESC
     SPACE
     PAGE_UP
     PAGE_DOWN
     END
     HOME
     LEFT_ARROW
     UP_ARROW
     RIGHT_ARROW
     DOWN_ARROW
     INSERT
     DELETE

/*string functions*/
left$(text, num)
len$(params)
mid$(text, start, num)
right$(text, num)
trim$()


/*Math functions*/
abs(params)   
acos(params)  
asin(params)  
atan(params)  
cos(params)   
exp(params)   
log(params)   
rnd(params)   
round(params) 
sin(params)
sqr(params)
tan(params)  
int(params)
val(params
distance(x1, y1, x2, y2)
dec2bin(dec)
bin2dec(bin)
