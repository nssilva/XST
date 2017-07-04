# XST3 simple library for 2d game canvas

**Version 0.3 Beta**
---

## License and copyright

Copyright (c) 2017 Nelson Silva

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---

## *Quick manual*

Opens a canvas with the width, height and in fullscreen = true or false and a title optional.

Example:
```javascript
    winScreen(640, 480, false, 'title');
```
if no width or height provided,
winScreen()-> the default would be 640 to 480 no fullscreen and Untitled as a title .

Set screen title.    
this can be done in winScreen or with a separeted function called setTitle().

If screen is in full mode then this title goes to the tab.

Example:
```javascript
    setTitle('Fractal');
```
Sets a font to the size and name given.

Example:
```javascript
    setFont(size, name);
```
Gets the font.

Example:
```javascript
    setFont(28, 'Algerian');
    var font = getFont();
```
	
This is the main loop function, if you need to repeat the code you must use the main function.

Example:
```javascript
	function main() {
		drawtext("Mouse X: "+ getmouseX(), 10, 20);
	}
```

Writes text to the screen at a gifven x and y coords.

Example:
```javascript
    drawText("Screen X: "+ screenWidth(), 10, 20);
```

Clears the screen, most used in main loop.
>(color is only used when we need alpha or something else like changing background color...)

Example:
```javascript
    clear();
    clear(rgb(255,255,255));
```


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

>Example:
```javascript	
    var player = loadTexture("images/player.png");
```
> drawTexture draws an image in the screen at given coords.

>example:
```javascript
    drawTexture(player, 100, 200);
```

getMouseX()
getMouseY()
getMouseButton()

getMouseState() 
example:
    var mouse = getMouseState();
    mouse.x, mouse.y, mouse.RMB, mouse.LMB

getKey()
getImageWidth(image)
getImageHeight(image)
getScreenHeight()
getScreenWidth()
Entitie(type, image, x, y)

> How to use entities.
> Example of a player like above but registered as entitie.

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

> String functions
```javascript
left$(text, num)
len$(params)
mid$(text, start, num)
right$(text, num)
trim$()
```

> Math functions
```javascript
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
```
---
## Screens
![Fearn](http://sdlbasic.epizy.com/site/fern.png)

---
#### *To see some examples and demos check this blog.*
[programmingrandomstuff](https://programmingrandomstuff.wordpress.com/)

---
# Author
* **Nelson Silva**
