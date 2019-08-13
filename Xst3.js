/*
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
*/

/*
@ XST WEB LIB 26/10/2016
@ author: Nelson Silva
@ This is a lib for canvas html5 based on sdlbasic and XST2 basic
@ last update: 24/01/2017 14:32
@ audio implemented
@ added main on the main file, this way is not needed anymore when you do not need a loop
@ pixel manipilation functions createImageData, putPixel, getPixel etc.
@ added getVersion, and getOS, strokeText 25/01/2017.
@ added vector class 12/02/2017 16:07
@ added gradients and small fixes 05/04/2017 11:43 (createGradient, gradientAddColor, getGradient, createRadialGradient, radialGradientAddColor, getRadialGradient)
@ added palette anc color commands 04/05/2017 11:34
@ added a simple Point object, and a frame to the window, stylish only, added a setTile command 05/05/2017 12:23
@ added a setIcon() command also, experiment with (back)buffer but it performs worst no need in html5, browser do that for you.
@ added max() and min() wrappers in Math functions 12/05/2017 14:22 
@ added star(x, y, size, color) and fillStar(x, y, size, color) 05/06/2017 10:04
@ fullscreen with resize added repaint() in case off fullscreen to handle the resize in browser 07/06/2017 14:41
*/

/*main config object*/
/**
 * (function(window, undefined) {
 *  var app = { };
 *  app.XST = {
 *  VERSION: '0.3 Beta',
 *  }
 * window.XST = app.XST;
 * })(window);
 */

var XST = XST || {};
XST = {
    VERSION: '0.3 Beta',
    Super: window,
    FPS: 60,
    width: 640,
    height: 480,
    canvas: null,
    context2D: null,
    Rect: { },
    RGBA: null,
    PI: Math.PI,
    OS: ['Windows', 'MacOS', 'UNIX', 'Linux'],
    COLOR: {
        WHITE: '#FFFFFF',
        BLACK: '#000000',
        RED: '#FF0000',
        YELLOW: '#FFFF00',
        SALMON: '#FA8072',
        PINK: '#FFC0CB',
        ORANGE: '#FFA500',
        VIOLET: '#EE82EE',
        GREEN: '#008000',
        DARKGREEN: '#006400',
        LIME: '#00FF00',
        AQUA: '#00FFFF',
        CYAN: '#00FFFF',
        BLUE: '#0000FF',
        DARKBLUE: '#00008B',
        NAVY: '#000080',
        GRAY: '#808080',
        SILVER: '#C0C0C0',
        GOLD: 'gold'
    },
    font: {
        type :"30px Arial",
        color: 'blue',
    },
    color: "white",
    backColor: "black",
    foreColor: '#0000FF',
    linewidth: 1,
    strokestyle: '',
    numimgs: 0,
    images: [],
    cacheImages: {},
    cacheSound: {},
    keys: {
        BACKSPACE: 8,
        TAB:    9,
        ENTER:  13,
        PAUSE:  19,
        CAPS:   20,
        ESC:    27,
        SPACE:  32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END:    35,
        HOME:   36,
        K_LEFT:   37,
        K_UP:     38,
        K_RIGHT:  39,
        K_DOWN:   40,
        INSERT: 45,
        DELETE: 46,
        0: 48,
        1: 49,
        2: 50,
        3: 51,
        4: 52,
        5: 53,
        6: 54,
        7: 55,
        8: 56,
        9: 57,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        NUMPAD_0: 96,
        NUMPAD_1: 97,
        NUMPAD_2: 98,
        NUMPAD_3: 99,
        NUMPAD_4: 100,
        NUMPAD_5: 101,
        NUMPAD_6: 102,
        NUMPAD_7: 103,
        NUMPAD_8: 104,
        NUMPAD_9: 105,
        MULTIPLY: 106,
        ADD: 107,
        SUBSTRAC: 109,
        DECIMAL: 110,
        DIVIDE: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PLUS: 187,
        COMMA: 188,
        MINUS: 189,
        PERIOD: 190,
        PULT_UP: 29460,
        PULT_DOWN: 29461,
        PULT_LEFT: 4,
        PULT_RIGHT: 5,
    },
    key: [],
    buffer: {
       create: function() {
            var self = { };
            self.back  = document.createElement('canvas');
            self.ctx2D = self.back.getContext('2d');
            XST.backBuffer = XST.backBuffer || { };
            XST.backBuffer.pointer = self;
            XST.backBuffer.isOn = true;
       }
    },
    cache: [],
    layers: { },
    fullscreen: false,
    log: function(text) {
        if (this.console_active)
            var text_console = document.getElementById('text_console');
            text_console.value += text + String.fromCharCode(13, 10);
    },
    PRINT: function(text) {
        console.log(text);
    },
    DOM: { 
        createEl: createEl,
        getEl: getEl
    }
};

function createEl(parent, element, id) {
    var el = document.createElement(element);
    el.setAttribute('id', id);
    parent.appendChild(el);
}

function getEl(id) {
    var doc = document;
    return doc.getElementById(id);
}

function winScreen(width, height, fullscreen, title) {
    fullscreen = fullscreen || false;
    XST.fullScreen = fullscreen;
    title = title || 'Untitled';
    width = width || XST.Rect.width;
    height = height || XST.Rect.height;
   
    if (fullscreen) {
        width  = XST.Super.innerWidth;
        height = XST.Super.innerHeight;
        document.title = title;
    }
    if (!fullscreen) {
        /*build a simple div to wrap this up to add some kind of panel into it*/
        //prototyte stuff
        var div_header = document.createElement('div');
        //div_header.style.position = 'relative';
        /*div_header.style.top = 0;
        div_header.style.left = 0;*/
        div_header.style.backgroundColor = XST.COLOR.SILVER;
        div_header.setAttribute('id', 'div_header');
        div_header.style.width = width+'px';
        div_header.style.border='3px solid '+XST.COLOR.SILVER;
        var div_panel = document.createElement('div');
        div_panel.setAttribute('id', 'div_panel');
        div_panel.setAttribute('width', width+'px');
        div_panel.setAttribute('height', '150px');
        var icon = document.createElement('img');
        icon.setAttribute('id', 'icon');
        icon.setAttribute('src', 'icon.png');
        icon.setAttribute('width', '16px');
        icon.setAttribute('height', '16px');
        div_panel.appendChild(icon);
        icon.style.cssFloat = 'left';
        var div = document.createElement('div');
        div.style.with = '100px';
        div.style.cssFloat = 'right';
        div.style.color= 'black';
        var canc = document.createElement('img');
        canc.src = 'del_ico.png';
        div.appendChild(canc);
        div_panel.appendChild(div);
        var div_t = document.createElement('div');
        div_t.setAttribute('id', 'div_title');
        div_t.style.cssFloat = 'left';
        div_t.style.color= 'black';
        div_t.style.margin='0px 2px';
        div_t.innerText = title;
        div_panel.style.margin = '0px 3px 5px 3px';
        div_panel.appendChild(div_t);
        /*if (fullscreen) {
            div_header.style.position = 'absolute';
            div_header.style.top = 0;
            div_header.style.left = 0;
        }*/
    }
    var screen2D = document.createElement('canvas');
    screen2D.setAttribute('width', width+'px');
    screen2D.setAttribute('height', height+'px');
    screen2D.setAttribute('id', 'screen2D');
    screen2D.setAttribute('background', 'transparent');
    //screen2D.style.position = 'absolute';
    //screen2D.style.zIndex = 1; 
    //screen2D.setAttribute('left', '0px');
    //screen2D.style.left = 0;
    //screen2D.setAttribute('top', '0px');
    //screen2D.style.top = 0;
    if(!fullscreen) {
        div_header.appendChild(div_panel);
        div_header.appendChild(screen2D);
        document.body.appendChild(div_header);
    } else {
        //screen2D.style.width ='100%';
        //screen2D.style.height='100%';
        screen2D.style.position = 'absolute';
        screen2D.style.top = 0;
        screen2D.style.left = 0;
        document.body.appendChild(screen2D);
        //document.body.style.margin = 0;
        //document.body.padding = 0;
    }
    //document.body.appendChild(screen2D);

    /*var div_console = document.createElement('div');
    div_console.setAttribute('id', 'console');
    div_console.setAttribute('width', width+'px');
    div_console.setAttribute('height', (height/2)+'px');
    div_console.style.border = '1px solid black';
    div_console.style.top = '15px';    
    var text_area = document.createElement('textarea');
    text_area.setAttribute('id', 'text_console');
    text_area.style.background = 'black';
    text_area.setAttribute('rows', 4);
    text_area.setAttribute('cols', 75);
    div_console.appendChild(text_area);
    text_area.style.color = XST.COLOR.WHITE;
    XST.console_active = true;
    document.body.appendChild(div_console);*/
    

    XST.canvas = screen2D;
    XST.context2D = XST.canvas.getContext('2d');

    XST.Rect.x = 0;
    XST.Rect.y = 0;
    XST.Rect.width  = width;
    XST.Rect.height = height;

    XST.context2D.fillStyle = XST.backColor;    
    XST.context2D.fillRect(XST.Rect.x, XST.Rect.y, XST.Rect.width, XST.Rect.height);
    
    initEvents();
    XST.animationID = requestAnimation(_update);
    screen2D=null;
}

function setBufferOn() {
    XST.buffer.create();
}

function openCanvas(id) {
    var parent = document.getElementById('div_header');
    var new_layer = document.createElement('canvas');
    var rect = XST.canvas.getBoundingClientRect();
    new_layer.setAttribute('id', id);
    new_layer.setAttribute('width', XST.canvas.width+'px');
    new_layer.setAttribute('height', XST.canvas.height+'px');
    new_layer.style.position = 'absolute';
    new_layer.style.left = rect.x;
    new_layer.style.top = rect.y;//rect.top;
    //new_layer.style.right = rect.right;
    //new_layer.style.bottom = rect.bottom;
    new_layer.style.zIndex = 2;
    XST.layers[id] = new_layer;
    parent.appendChild(new_layer);
    rect = null;
}

function canvasScreen(id) {
    var screen = XST.layers[id];
    var screen2D = screen.getContext('2d');
    return screen2D;
}

function setTitle(text) {
    var title = document.getElementById('div_title');
    title.innerText = '';
    title.innerText = text;
    title = null;
}

function setIcon(path) {
    var icon = document.getElementById('icon');
    icon.src ='';
    icon.src=path;
    icon.style.width  = '16px';
    icon.style.height = '16px';
}

function initEvents() {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    XST.canvas.addEventListener('click', onClick, false);
    XST.canvas.addEventListener('mousemove', onMouseMove, false);
    XST.canvas.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener("contextmenu", function(e) {e.preventDefault();}, false);
    XST.canvas.addEventListener('mouseup', onMouseUp, false);
    XST.canvas.addEventListener('touchstart', onTouchStart, false);
    XST.canvas.addEventListener('touchmove', onTouchMove, false);
    if (XST.fullScreen) {window.addEventListener('resize', resizeCanvas, false);}
    initKeys();
}

function onClick(e) {
    e = e || window.event;
    e.preventDefault();
    //not yet implemented
}

function onTouchStart(e) {
    e = e || window.event;
    var x = e.targetTouches[0].pageX;
    var y = e.targetTouches[0].pageY;
    //not yet implemented
}

function onTouchMove(e) {
    // e = e || window.event;
    //not yet implemented
}

function onMouseDown(e) {
    e = e || window.event;
    fixpageXY(e);
    var rect = XST.canvas.getBoundingClientRect();
    XST.mouseX = e.clientX-rect.left;
    XST.mouseY = e.clientY-rect.top;
    XST.MB = e.button;
    rect = null;
    XST.mouseClick = true;
}

function getMouseButton() {
    var mb = {0: 'LMB', 1: 'WHL', 2: 'RMB'};
    if(XST.MB) {
        return mb[XST.MB];
    }
    return false;
}

function onMouseUp(e) {
    e = e || window.event;
    fixpageXY(e);
    var rect = XST.canvas.getBoundingClientRect();
    XST.mouseX = e.clientX-rect.left;
    XST.mouseY = e.clientY-rect.top;
    XST.MB = undefined;
    rect = null;
    XST.mouseClick = false;
}

function mouseOnClick() {
    if(XST.mouseClick !== undefined) {
        return XST.mouseClick;
    }
    return false;
}

function initKeys() {
   for (var x = 0; x < Object.keys(XST.keys).length; x++) {
        XST.key[x] = 0;
    }
}

function setKey(value) {
    var key;
    for(key in XST.keys) {
	    if(XST.keys[key] === value) {
		    return key;
		}
	}
	return null;
}

function isKeyDown(key) {
    return XST.key[XST.keys[key]] === 1;
}

function onKeyDown(e) {
    e = e || window.event;
    XST.key[e.keyCode] = 1;
}

function onKeyUp(e) {
    e = e || window.event;
    XST.key[e.keyCode] = 0;
}

function getKey() {
    var len = XST.key.length;
    for(var x = 0; x <len; x++) {
        if(XST.key[x]===1) {
            return setKey(x);
        }
    }
    return 'unknown key';
}

function onMouseMove(e) {
    e = e || window.event;
    fixpageXY(e);
    var rect = XST.canvas.getBoundingClientRect();
    XST.mouseX = e.clientX-rect.left;//e.offsetX;//e.pageX;
    XST.mouseY = e.clientY-rect.top;//e.offsetY;//e.pageY;
    rect = null;
    XST.isMouseMoving = true;
}

function resizeCanvas(e) {
    XST.canvas.width  = window.innerWidth;
    XST.canvas.height = window.innerHeight;
    XST.Rect.width = XST.canvas.width;
    XST.Rect.height = XST.canvas.height;
    repaint();
}

function isMouseMoving() {
    if(XST.isMouseMoving !== undefined) {
        return XST.isMouseMoving;
    }
    return false;
}

function getMouseX() {
    return XST.mouseX || 0;
}

function getMouseY() {
    return XST.mouseY || 0;
}

function getMouseState() {
    return {
        x  : getMouseX(),
        y  : getMouseY(),
        LMB: XST.MB === 0 ? true: false,
        RMB: XST.MB === 2 ? true: false
    }
}

function clear(color) {
    if(color) {
        XST.context2D.fillStyle = color;
        XST.context2D.fillRect(XST.Rect.x, XST.Rect.y, XST.Rect.width, XST.Rect.height);
    } else {
        XST.context2D.fillStyle = XST.backColor;
        XST.context2D.clearRect(XST.Rect.x, XST.Rect.y, XST.Rect.width, XST.Rect.height);
        XST.context2D.fillRect(XST.Rect.x, XST.Rect.y, XST.Rect.width, XST.Rect.height);
    }
}

function getDocumentBody() {
    return document.body;
}

function setDocumentBodyColor(color) {
    var body = getDocumentBody();
    body.style.backgroundColor = color;
}

function getCanvasContext() {
    return XST.context2D;
}

function getCanvas() {
    return XST.canvas;
}

function getRect() {
    return XST.Rect;
}

function rgb(r, g, b) {
    return 'rgb('+r+','+g+','+b+')';
}

function rgba(r, g, b, a) {
    return 'rgba('+r+','+g+','+b+','+a+')';
}
//0-... 0-100%, 0-100%
function hsl(hue, sat, light) {
    return 'hsl('+hue+','+sat+'%,'+light+'%)';
}

function hsla(hue, sat, light, alpha) {
    return 'hsla('+hue+','+sat+'%,'+light+'%,'+alpha+')';
}

function setBackColor(color) {
    XST.backColor = color;
    clear();
}

function setColor(color) {
    XST.foreColor = color;
}

function getColor() {
    return XST.foreColor;
}

function getRandomColor() {
    /*var colorRGB = new ColorRGB(floor(rnd(255)), floor(rnd(255)), floor(rnd(255)));
    return rgb(colorRGB.r, colorRGB.g, colorRGB.b);*/
    var rgb_model = colorRGB.create();
    rgb_model.setValues(floor(rnd(255)), floor(rnd(255)), floor(rnd(255)));
    return rgb_model.getRGB();
}

function getRandomRGBA() {
    //var _rgba = new ColorRGBA(floor(rnd(256)), floor(rnd(256)), floor(rnd(256)), rnd());
    //return rgba(_rgba.r, _rgba.g, _rgba.b, _rgba.a);
    var rgba_model = colorRGBA.create();
    rgba_model.setValues(floor(rnd(256)), floor(rnd(256)), floor(rnd(256)), rnd());
    return rgba_model.getRGBA();
}

function palette() {
    var colors = arguments;
    var x = 0;
    XST.palette = [];
    for (x = 0; x < colors.length; x++) {
        XST.palette[x] = colors[x];
    }
}

function color(index) {
    index = index || 0;
    if (XST.palette !== undefined) {
        if (index >= 0 && index <= XST.palette.length) {
            return XST.palette[index];
        } 
    }
}

var colorRGB = {
    r: 0,
    g: 0,
    b: 0,
    create: function() {
        return Object.create(this);
    },
    setValues: function(r, g, b) {
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
    },
    getRGB: function() {
        return rgb(this.r, this.g, this.b);
    }
}

var ColorRGB = {
    r: 0,
    g: 0,
    b: 0,
    create: function(r, g, b) {
        this.r = r; 
        this.b = b;
        this.g = g;
        return Object.create(this);
    }
};

/*
function ColorRGB(r, g, b) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
}
*/

var colorRGBA = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
    create: function() {
        return Object.create(this);
    },
    setValues: function(r, g, b, a) {
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 0;
    },
    getRGBA: function() {
        return rgba(this.r, this.g, this.b, this.a);
    }
}

/*function ColorRGBA(r, g, b, a) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a || 0;
}*/

function ColorHSV(h, s, v) {
    this.h = h || 0;
    this.s = s || 0;
    this.v = v || 0;
}

function HSVtoRGB(colorHSV) {
  var h = colorHSV.h /256;    
  var s = colorHSV.s /256;
  var v = colorHSV.v /256;
  var r=0, g=0, b=0;

  if(s === 0) {
       r = g = b = v;
  }
  else {
       h = h * 6;//hs / 60;
       var i  = floor(h);
       var f = h - i;

       var p = v * (1 - s);
       var q = v * (1 - (s * f));
       var t = v * (1 - (s * (1 - f)));

       switch(i) {
           case 0:
               r=v;g=t;b=p;
               break;
           case 1:
               r=q;g=v;b=p;
               break;
           case 2:
               r=p;g=v;b=t;
               break;
           case 3:
               r=p;g=q;b=v;
               break;
           case 4:
               r=t;g=p;b=v;
               break;
           case 5:
               r=v;g=p;b=q;
               break;
           default: 
               r=0;g=0;b=0;
               break;
    }
  }
  var colorRGB = ColorRGB.create(int(r*255), int(g*255), int(b*255));
  return colorRGB;
}

function createImageData(w, h) {
    return XST.context2D.createImageData(w, h);
}

function getImageData(sx, sy, sw, sh) {
    return XST.context2D.getImageData(sx, sy, sw, sh);
}

function putImageData(imgData, x, y, xdirty, ydirty, swdirty, shdirty) {
    if(xdirty) {
        XST.context2D.putImageData(imgData, x, y, xdirty, ydirty, swdirty, shdirty);    
    } else {
        XST.context2D.putImageData(imgData, x, y);
    }
}

function setPixel(imgData, x, y, r, g, b, a) {
    var index = (x+y*imgData.width) * 4;
    imgData.data[index  ] = r;
    imgData.data[index + 1] = g;
    imgData.data[index + 2] = b;
    imgData.data[index + 3] = a;
}

function getPixel(imgData, x, y) {
    var index = (x+y*imgData.width) * 4;
    var pixel = {
        r: imgData.data[index    ],
        g: imgData.data[index + 1],
        b: imgData.data[index + 2],
        a: imgData.data[index + 3]
    };
    return pixel;
}

function rect(x, y, width, height, linewidth, bordercolor) {
        XST.context2D.beginPath();
        XST.context2D.lineWidth = linewidth || XST.linewidth;
        XST.context2D.strokeStyle = bordercolor || XST.color;
        XST.context2D.rect(x, y, width, height);
        XST.context2D.stroke();
        XST.context2D.closePath();
}

function fillRect(x, y, width, height, color) {
    XST.context2D.fillStyle = color || XST.color; 
    XST.context2D.fillRect(x, y, width, height);
    XST.context2D.stroke();
}

function line(x1, y1, x2, y2, linewidth, color) {
    XST.context2D.strokeStyle = color || XST.color;
    XST.context2D.beginPath();
    XST.context2D.moveTo(x1, y1);
    XST.context2D.lineTo(x2, y2);
    XST.context2D.lineWidth = linewidth || XST.linewidth;
    XST.context2D.stroke();
    XST.context2D.closePath();
}

function drawPixel(x, y, color) {
    XST.context2D.fillStyle = color || XST.color;
    XST.context2D.fillRect(x, y, 1, 1);
}

function circle(x, y, radius, bordercolor) {
    XST.context2D.beginPath();
    XST.context2D.arc(x, y, radius, 0, 2 * Math.PI, true);
    XST.context2D.strokeStyle = bordercolor || XST.color;
	XST.context2D.stroke();
    XST.context2D.closePath();
}

function fillCircle(x, y, radius, fillcolor) {
    XST.context2D.beginPath();
    XST.context2D.arc(x, y, radius, 0, 2 * Math.PI, false);
    XST.context2D.fillStyle = fillcolor || XST.color;
    XST.context2D.fill();
}
/*not implemented yet.*/
function ellipse(x, y, w, h, color) {
    var context = XST.context2D;
    context.translate(x+w/2, y+h/2);
    context.scale(w/2, h/2);
    context.beginPath();
    context.arc(0,0,1,0,Math.PI * 2, false);
    context.strokeStyle = color;
    context.stroke();
    context = null;
}

function star(x, y, s, color) {
    var c = XST.context2D;
    color = color || XST.COLOR.WHITE;
    c.strokeStyle = color;
    c.beginPath();
    c.moveTo(x, y+s*0.4);
    c.lineTo(x + s, y + s * 0.4);
    c.lineTo(x + s * 0.15, y + s * 0.9);
    c.lineTo(x + s / 2, y);
    c.lineTo(x + s * 0.85, y + s * 0.9);
    c.lineTo(x, y + s * 0.4);
    c.stroke();
    c=null;
}

function fillStar(x, y, s, color) {
  var c = XST.context2D;
  color = color || XST.COLOR.WHITE;
  c.fillStyle = color;
  c.beginPath();
  c.moveTo(x, y + (s * 0.4));
  c.lineTo(x + s, y + s * 0.4);
  c.lineTo(x + s * 0.15, y + s * 0.9);
  c.lineTo(x + s / 2, y);
  c.lineTo(x + s * 0.85, y + s * 0.9);
  c.lineTo(x, y + s * 0.4);
  c.fill();
  c=null;
}

function bar(x, y, x1, y1, color) {
    color = color || XST.backColor;
    var tmp, rect = { };

    if (x1<x) {
        tmp = x1;
        x1 =x;
        x=tmp;
    }
    if (y1< y) {
        tmp = y1;
        y1=y;
        y=tmp;
    }

    rect.x=x;
	rect.y=y;
	rect.w=x1-x+1;
	rect.h=y1-y+1;

    fillRect(rect.x, rect.y, rect.w, rect.h, color);
    rect = null;
}

function saveCanvas() {
    XST.context2D.save();
}

function translate(x, y) {
    XST.context2D.translate(x, y);
}

function rotate(angle) {
    XST.context2D.rotate(angle);
}

function scale(x, y) {
    XST.context2D.scale(x, y);
}

function restoreCanvas() {
    XST.context2D.restore();
}

function timeStamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

/*var now, last=timestamp();
var dt = 0, step = 1 / XST.config.FPS;
var delay = 1000/XST.config.FPS;
function _update() {
    now = timestamp();
    dt = dt + Math.min(1, (now-last)/delay);
    while(dt > step) {
        dt = dt - step;
        main();
    }
    last = now;
    window.requestAnimationFrame(_update);
}
*/
/*
var then = Date.now();
var now;
var interval = 1000/XST.config.FPS;
var delta;
function _update() {
    requestAnimationFrame(_update);
    now = Date.now();
    delta = (now - then);
    if(delta > interval) {
        then = now - (delta%interval);
        main();
    }
}*/

function setFps(fps) {
    fps = fps || XST.FPS;
    XST.FPS = fps;
}
 
function getFps() {
    return XST.FPS;
}

function pause(flag) {
    XST.isPaused = flag;
}

function _update() {
    var then = timeStamp();//Date.now();
    var interval = 1000 / getFps();
    return (function loop() {
        if (!XST.isPaused) {
            XST.animationID = requestAnimation(loop);
            var now = timeStamp();//Date.now();
            var delta = (now - then);
            if(delta > interval) {
                then = (now - (delta%interval));
                main();
            }
        }
    })(0);
}

//create some kind of tracer with slot so we can see if this image is loaded or not.
function loadTexture(path, slot) {
    var image;
    if(path) {
        if(XST.cacheImages[path.substring(0, path.indexOf('.'))]) {
            return XST.cacheImages[path.substring(0, path.indexOf('.'))].image;
        } else {
            image = new Image();
            image.onload = function() {
                XST.cacheImages[path.substring(0, path.indexOf('.'))] = {};
                XST.cacheImages[path.substring(0, path.indexOf('.'))].image = image;
                XST.cacheImages[path.substring(0, path.indexOf('.'))].slot = slot;
                XST.cacheImages[path.substring(0, path.indexOf('.'))].isLoaded = true;
            };
            image.src = path;
            return image;
        }
    }
}

function isTextureLoaded(slot) {
    if(XST.cacheImages) {
        for(var prop in XST.cacheImages) {
            if(XST.cacheImages.hasOwnProperty(prop)) {
                if(XST.cacheImages[prop].slot === slot) {
                    return XST.cacheImages[prop].isLoaded
                }
            }
        }
    }
    return false;
}

var Sprite = {
    isLoaded: false,
    isVisible: false,
    image: null,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    loadTexture: function(image) {
        var obj = Object.create(this);
        obj.image = new Image();
        obj.image.src = image;
        obj.image.onload = function() {
            obj.width  = obj.image.width;
            obj.height = obj.image.height;
            obj.isLoaded = true;
        }
        return obj;
    },
    draw: function() {
        XST.context2D.drawImage(this.image, this.x, this.y);
    }
};
/*
function Sprite(sprite, x, y) {
    this.load(sprite);
    this.x = x || 0;
    this.y = y || 0;
    this.width = 0;
    this.height = 0;
    this.isLoaded = false;
    this.isVisible = false;
}

Sprite.prototype.load = function(sprite) {
    this.image = new Image();
    var that = this;   

    this.image.src = sprite;

    this.image.onload = function() {
        that.width  = that.image.width;
        that.height = that.image.height;
        that.isLoaded = true;
    }
};

Sprite.prototype.draw = function() {
    XST.context2D.drawImage(this.image, this.x, this.y);
};
*/
//Must check if image is loaded
function drawTexture(img, x, y) {
    x = x || 0;
    y = y || 0;
    if (isImage(img)) {
        var img_name = img.src.substring(img.src.lastIndexOf('/')+1);
        var f_img = img_name.substring(0, img_name.indexOf('.'));
        if(XST.cacheImages[f_img]) {
            XST.context2D.drawImage(img, x, y);
        } else {
           XST.context2D.drawImage(img, x, y); 
        }
    }
};

function SpriteSheet(path, frameWidth, frameHeight) {
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.sprite = new Image();

    var me = this;
    this.sprite.onload = function() {
        me.framesPerRow = floor(me.sprite.width/me.frameWidth);
    };
    this.sprite.src = path;
}

function Animation(spritesheet, frameSpeed, startFrame, endFrame) {
    var animationSequence = [];
    var curFrame = 0;
    var counter = 0;

    for(var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++) {
        animationSequence.push(frameNumber);
    }

    this.update = function() {
        if(counter == (frameSpeed-1)) {
            curFrame = ((curFrame + 1) % animationSequence.length);
        }
        counter = (counter+1)%frameSpeed;
    };

    this.draw = function(x, y) {
        var row = floor(animationSequence[curFrame] / spritesheet.framesPerRow);
        var col = floor(animationSequence[curFrame] % spritesheet.framesPerRow);
        XST.context2D.drawImage(spritesheet.sprite, col * spritesheet.frameWidth, row * spritesheet.frameHeight, spritesheet.frameWidth, spritesheet.frameHeight, x, y, spritesheet.frameWidth, spritesheet.frameHeight);
    };
}

function hasAudio() {
  if(window.Audio) {
      return true;
  }
  return false;
}

function loadAudio(audio) {
    var sound = document.createElement("audio");
    document.body.appendChild(sound);
    //sound.canPlayType('audio/ogg; codecs="vorbis"');
    if(cacheSound[audio.substring(0, audio.indexOf('.'))]) {
        return cacheSound[audio.substring(0, audio.indexOf('.'))];
    } else {
        cacheSound[audio.substring(0, audio.indexOf('.'))]=audio;
        sound.src = audio;
    }
    return sound;
}

function playAudio(audio) {
    if(audio) {
        audio.play();
    }
}

function pauseAudio(audio) {
    if(audio) {
        audio.pause();
    }
}

function stopAudio(audio) {
    if(audio) {
        audio.pause();
        audio.currentTime=0;
    }
}

function setFont(size, name) {
    XST.font.type = size+'px '+name;
}

function getFont() {
    return XST.font.type;
}

function drawText(text, x, y) {
    XST.context2D.lineWidth = getLineWidth();
    XST.context2D.fillStyle = XST.foreColor;
    XST.context2D.font = XST.font.type;
    XST.context2D.fillText(text, x, y);
}

function setLineWidth(linewidth) {
    XST.linewidth = linewidth || 1;
}

function getLineWidth() {
    return XST.linewidth;
}

function strokeText(text, x, y, color, fillcolor) {
    var style = '';
    (color!== undefined) ? style = color : style = XST.foreColor;
    XST.context2D.lineWidth = getLineWidth();
    XST.context2D.strokeStyle = style;
    XST.context2D.font = XST.font.type;
    XST.context2D.strokeText(text, x, y);
    if(fillcolor) {
        XST.context2D.fillStyle = fillcolor;
        XST.context2D.fillText(text, x, y);
    }
}

function createGradient(x0, y0, x1, y1) {
    XST.gradient = XST.context2D.createLinearGradient(x0, y0, x1, y1);
}

function gradientAddColor(num, color) {
    XST.gradient.addColorStop(num, color);
}

function getGradient() {
    return XST.gradient;
}

function createRadialGradient(x0, y0, r0, x1, y1, r1) {
    XST.radialgradient = XST.context2D.createRadialGradient(x0, y0, r0, x1, y1, r1);
}

function radialGradientAddColor(num, color) {
    XST.radialgradient.addColorStop(num, color);
}

function getRadialGradient() {
    return XST.radialgradient;
}

function Entitie(type, img, x, y) {
    this.type = type || '';
    this.image = loadTexture(img) || '';
    this.x = x || 0;
    this.y = y || 0;
    this.width  = getImageWidth(this.image)  || 0;
    this.height = getImageHeight(this.image) || 0;
}

function entitieCollide(obj1, obj2) {
    if(
        obj1.x < (obj2.x + obj2.width) &&
        (obj1.x + obj1.width) > obj2.x &&
        obj1.y < (obj2.y + obj2.height) &&
        (obj1.y + obj1.height) > obj2.y
    ) {
        return true;
    }
    return false;
}

function getScreenWidth() {
    return XST.Rect.width;
}

function getScreenHeight() {
    return XST.Rect.height;
}

function getNumberOfImages() {
    return XST.numimgs;
}

function getImageHeight(image) {
    return image.height;
}

function getImageWidth(image) {
    return image.width;
}

function isImage(img) {
    return img instanceof HTMLImageElement;
}

function imageCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    if(
        x1 < x2 + w2 &&
        x1 + w1 > x2 &&
        y1 < y2 + h2 &&
        y1 + h1 > y2
    )
    {
        return true;
    }
    return false;
}
/*distance between two points x1, y1, x2, y2*/
function distance(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return sqrt(dx * dx + dy * dy);
}
/*Math functions*/
function abs(params)   { return Math.abs(params);   }
function floor(params) {return Math.floor(params);  }
function acos(params)  { return Math.acos(params);  }
function asin(params)  { return Math.asin(params);  }
function atan(params)  { return Math.atan(params);  }
function atan2(par1, par2) {return Math.atan2(par1, par2);}
function cos(params)   { return Math.cos(params);   }
function exp(params)   { return Math.exp(params);   }
function log(params)   { return Math.log(params);   }
function rnd(params) { 
    if(params) {
       return Math.random()*params;
    }
    return Math.random();
}
function round(params) { return Math.round(params); }
function sin(params)   { return Math.sin(params);   }
function sqrt(params)  { return Math.sqrt(params);  }
function tan(params)   { return Math.tan(params);   }
//function int(params)   { return ~~params; }
function int(params)   { return round(params); }
function val(params)   { return params-'0'; } /*+(params) || params*1*/
function randomReal(xmin, xmax) { return (rnd(xmax - xmin) + xmin);}
function randomInt(xmin, xmax) { return int(rnd(xmax + 1 - xmin) + xmin); }
function min(a, b) { return Math.min(a, b); }
function max(a, b) { return Math.max(a, b); }

function degToRad(deg) {
    deg = deg || 0;
    return (deg * XST.PI) / 180;
}

function radToDeg(rad) {
    rad = rad || 0;
    return (rad * 180) / XST.PI;
}

function decToBin(i) {
    var buf = '';
    var ret = '';
    while(i > 0) {
        if((i%2) === 0) {
            buf+='0';
        } else {
            buf+='1';
        }
        i = parseInt(i / 2);
    }
    var l = buf.length;
    for(var x = 0; x < l; x++) {
        ret+=buf[l-x-1];
    }
    return ret;
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

function bin2dec(bin) {
    return parseInt(bin, 2).toString(10);
}
/*end of math wrapper functions*/
/*
@function that accepts a point and calcs the distance between 2 points
@ function distance(p, q) {
@   var dx = p.x - q.x;
@   var dy = p.y - q.y;
@   return sqrt(dx * dx + dy * dy);   
@ }
@
*/
/*string functions*/
function left$(text, num) { return text.substring(0, num); }
function len$(params) { return params.length; }
function mid$(text, start, num) { return text.substring(start, start+num); }
function right$(text, num) { return text.substring($len(text)-num, $len(text)); }
function trim$(text) { return text.trim(); }
function uppercase(text) {if (text) return text.toUpperCase(); }
function lowercase(text) { if (text) return text.toLowerCase(); }
/*end of the string functions*/

/*fix the coords in canvas*/
function fixpageXY(e) {
    if(e.pageX == null && e.clientX != null) {
        var html = document.documentElement;
        var body = document.body;

        e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
        e.pageX -= html.clientLeft || 0;

        e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
        e.pageY -= html.clientTop || 0;
    }
}
/*smoth animation*/
function requestAnimation(what) {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame 
    || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame
    || function(what) {window.setTimeout(what, 1000 / getFps());};
   return requestAnimationFrame(what);
}

function stopAnimation(requestID) {
    var stopAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function(requestID) {clearTimeout(requestID);}
    stopAnimationFrame(requestID);
}

function stop() {
    stopAnimation(XST.animationID);
}

function getVersion() {
    return XST.VERSION;
}

function getOS() {
    if(window.navigator) {
        var Os = navigator.appVersion; 
        if (Os.indexOf("Win")!=-1)   return XST.OS[0];
        if (Os.indexOf("Mac")!=-1)   return XST.OS[1];
        if (Os.indexOf("X11")!=-1)   return XST.OS[2];
        if (Os.indexOf("Linux")!=-1) return XST.OS[3];
    }
    return 'Unknown OS';
}

/*
time functions
*/
function getTime() {
    var dat = new Date();
    var hour = dat.getHours();
    var min = dat.getMinutes();
    if(min<10)min = '0'+min;
    var secs = dat.getSeconds();
    if(secs<10) secs = '0'+secs;  
    return hour+':'+min+':'+secs;
}

function getHour() {
    return new Date().getHours();
}

function getMinutes() {
    return new Date().getMinutes();
}

function getSeconds() {
    return new Date().getSeconds();
}

function ticks() {
    return timeStamp();
}

function wait(nsec) {
    setTimeout(dummy, nsec);
}

function dummy() { }

/*
 * @simple vector object 
*/
var Vector = {
    _x: 0,
    _y: 0,
    create: function(x, y) {
        var o = Object.create(this);
        this.setX(x);
        this.setY(y);
        return o;
    },
    setX: function(val) {
        this._x = val;
    },
    setY: function(val) {
        this._y = val;
    },
    getX: function() {
        return this._x;
    },
    getY: function() {
        return this._y;
    },
    setAngle: function(angle) {
        var len = this.getLength();
        this._x = cos(angle) * len;
        this._y = sin(angle) * len;
    },
    getAngle: function() {
        return atan2(this._x, this._y);
    },
    setLength: function() {
        var angle = this.getAngle();
        this._x = cos(angle) * length;
        this._y = sin(angle) * length;
    },
    getLength: function() {
        return sqrt(this._x * this._x + this._y * this._y);
    },
    add: function(vec2) {
        return Vector.create(this._x + vec2.getX(), this._y + vec2.getY());
    },
    sub: function(vec2) {
        return Vector.create(this._x - vec2.getX(), this._y - vec2.getY());
    },
    mult: function(val) {
        return Vector.create(this._x * val, this._y * val);
    },
    div: function(val) {
        return Vector.create(this._x / val, this._y / val);
    }
}

function Point(x, y) {
    this._x = x || null;
    this._y = y || null;
}

/*
function Vector(_x, _y) {
    this.x = _x;
    this.y = _y;
}

Vector.prototype.norm = function() {
    var m = this.mag();
    if (m !== 0) {
        this.div(m);
    }
};

Vector.prototype.setX = function(val) {
    this.x = val;
};

Vector.prototype.setY = function(val) {
    this.y = val;
};

Vector.prototype.getX = function() {
    return this.x;
};

Vector.prototype.getY = function() {
    return this.y;
};

Vector.prototype.mult = function(n) {
    this.x = this.x * n;
    this.y = this.y * n;
};

Vector.prototype.sub = function(v) {
    this.x = this.x - v.x;
    this.y = this.y - v.y;
};

Vector.prototype.add = function(v) {
    this.x = this.x + v.x;
    this.y = this.y + v.y;
};

Vector.prototype.div = function(n) {
    this.x = this.x / n;
    this.y = this.y / n;
};

Vector.prototype.mag = function() {
    return sqrt(this.x*this.x+this.y*this.y);
};

function Point(x, y) {
    this.x = x;
    this.y = y;
}
*/
/*console.log text for debugging*/
//this one logs into console.log from browser
function print(text) {
    XST.PRINT(text);
}
//this logs into a textarea
/*function log(text) {
    XST.log(text);
}*/
/* end console*/

function Stack(num) {
    this.store  = { };
    this.index  = 0;
    this.size   = num;
}

Stack.prototype.push = function(val) {
    if (val) {
        if (this.index < this.size) {
            this.store[this.index]=val;
            this.index++;
        }
    }
};

Stack.prototype.setSize = function(num) {
    this.size = num;
}

Stack.prototype.size = function() {
    return this.size;
};

Stack.prototype.search = function(slot) {
    for(var i in this.store) {
        if (this.store[i].slot === slot) {
            return this.store[i].data;
        }
    }
}

Stack.prototype.pop = function() {
    if (this.index >= 0) {
          var v = this.store[this.index];
          delete this.store[this.index];
          this.index--;
          return  v;
        }
};
/**
 * @uses stack class  
 * @Memory banks test
 * @param {any} bank 
 * @param {any} number 
 */
function reserveBank(bank, number) {
    bank = bank || 0;
    number = number || 0;
    XST.bank = XST.bank || {};
    if (XST.bank[bank] === undefined) {
        XST.bank[bank] = new Stack(number);
    }
}

function poke(bank, slot, data) {
    if (XST.bank[bank]) {
        if (XST.bank[bank].index < XST.bank[bank].size) {
            XST.bank[bank].push({
                slot: slot,
                data: data
            });
        }
    }
}

function peke(bank, slot) {
    if (XST.bank[bank]) {
        return XST.bank[bank].search(slot);
    }
}

/*experimental functions*/
function extend(obj, props) {
    for(var prop in props) {
        obj[prop] = props[prop];
    }
    return obj;
}

//extend(XST, {extend: extend});

//var xst = Object.create(XST);
/*alias*/
var COLOR = XST.COLOR;
var PI = XST.PI;
var PI_2 = PI * 2;

function main() { }
main();
/*end alias*/

//XST.create = Object.create;
//end of experimental functions

/*to clear all objects clear memory*/
function close() {
	XST.Rect = null;
    XST.COLOR = null;
    XST.font = null;
    XST.cacheImages = null;
    XST.cacheSound = null;
    XST.keys = null;
    XST = null;
    COLOR = null;
};
window.onclose = function() {close();}
