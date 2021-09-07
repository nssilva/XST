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
@ new class ES6 system for xst 17:41 08/08/2019
*/

class ColorHSV {
    constructor(h, s, v) {
        this._h = h;
        this._s = s;
        this._v = v;
    }
    set h(h) {
        this._h = h;
    }
    get h() {
        return this._h;
    }
    set s(s) {
        this._s = s;
    }
    get s() {
        return this._s;
    }
    set v(v) {
        this._v = v;
    }
    get v() {
        return this._v;
    }
}

class Sprite {
    constructor() {
        this._isLoaded = false;
        this._isVisible = false;
        this._image = null;
        this._width = 0;
        this._height = 0;
        this._x = 0;
        this._y = 0;
    }
    loadTexture(image) {
        this.image = new Image();
        this.image.src = image;
        var me = this;
        this.image.onload = function() {
            me.width = this.width;
            me.height = this.height;
            me.isLoaded = true;
        };
        return this.image;
    }
    set width(w) {
        this._width = w;
    }
    get width() {
        return this._width;
    }
    set height(h) {
        this._height = h;
    }
    get height() {
        return this._height;
    }
    set image(image) {
        this._image = image;
    }
    get image() {
        return this._image;
    }
    set x(x) {
        this._x = x;
    }
    get x() {
        return this._x;
    }
    set y(y) {
        this._y = y;
    }
    get y() {
        return this._y;
    }
    draw() {
        if (this.isLoaded) {
            xst.context2D.drawImage(this.image, this.x, this.y);
        }
    }
    set isLoaded(loaded) {
        this._isLoaded = loaded;
    }
    get isLoaded() {
        return this._isLoaded;
    }
    set isVisible(v) {
        this._isVisible = v;
    }
    get isVisible() {
        return this._isVisible;
    }
}

class SpriteSheet {
    constructor(path, frameWidth, frameHeight) {
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.sprite = new Image();
        this.framesPerRow = null;
        this.isLoaded = false;
        var me = this;
        this.sprite.onload = function() {
            me.framesPerRow = floor(me.sprite.width / me.frameWidth);
            me.isLoaded = true;
        };
        this.sprite.src = path;
    }
}

class Animation extends SpriteSheet {
    constructor(path, frameWidth, frameHeight, frameSpeed, startFrame, endFrame) {
        super(path, frameWidth, frameHeight);
        this.animationSequence = [];
        this.curFrame = 0;
        this.counter = 0;
        this.frameSpeed = frameSpeed;

        for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++) {
            this.animationSequence.push(frameNumber);
        }
    }
    update() {
        if (this.counter == this.frameSpeed - 1) {
            this.curFrame = (this.curFrame + 1) % this.animationSequence.length;
        }
        this.counter = (this.counter + 1) % this.frameSpeed;
    }
    draw(_x, _y) {
        var row = floor(this.animationSequence[this.curFrame] / this.framesPerRow);
        var col = floor(this.animationSequence[this.curFrame] % this.framesPerRow);
        if (this.isLoaded) {
            xst.context2D.drawImage(
                this.sprite,
                col * this.frameWidth,
                row * this.frameHeight,
                this.frameWidth,
                this.frameHeight,
                _x,
                _y,
                this.frameWidth,
                this.frameHeight
            );
        }
    }
}

class ColorRGB {
    constructor(r, g, b) {
        this._r = r;
        this._g = g;
        this._b = b;
    }
    setValues(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    set r(r) {
        this._r = r;
    }
    get r() {
        return this._r;
    }
    set g(g) {
        this._g = g;
    }
    get g() {
        return this._g;
    }
    set b(b) {
        this._b = b;
    }
    get b() {
        return this._b;
    }
    getRGB() {
        return rgb(this.r, this.g, this.b);
    }
}

class ColorRGBA {
    constructor() {
        this._r = 0;
        this._g = 0;
        this._b = 0;
        this._a = 0;
    }
    setValues(r, g, b, a) {
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 0;
    }
    set r(r) {
        this._r = r;
    }
    get r() {
        return this._r;
    }
    set g(g) {
        this._b = b;
    }
    get g() {
        return this._g;
    }
    set b(b) {
        this._b = b;
    }
    get b() {
        return this._b;
    }
    set a(a) {
        this._a = a;
    }
    get a() {
        return this._a;
    }
    getRGBA() {
        return this.rgba(this.r, this.g, this.b, this.a);
    }
}

class Stack {
    constructor(number) {
        this._store = {};
        this._index = 0;
        this._size = number;
    }
    set size(size) {
        this._size = size;
    }
    get size() {
        return this._size;
    }
    push(val) {
        if (val) {
            if (this._index < this._size) {
                this._store[this._index] = val;
                this._index++;
            }
        }
    }
    search(slot) {
        for (let i in this._store) {
            if (this._store[i].slot === slot) {
                return this._store[i].data;
            }
        }
    }
    pop() {
        if (this._index >= 0) {
            let v = this._store[this._index];
            delete this._storte[this._index];
            this._index--;
            return v;
        }
    }
}

class Point3D {
    constructor(x, y, z) {
        this._x = x;
        this._y = y;
        this._z = z;
    }
    set x(x) {
        this._x = x;
    }
    get x() {
        return this._x;
    }
    set y(y) {
        this._y = y;
    }
    get y() {
        return this._y;
    }
    set z(z) {
        return this._z;
    }
    get z() {
        return this._z;
    }
}

class Point {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }
    set x(x) {
        this._x = x;
    }
    get x() {
        return this._x;
    }
    set y(y) {
        this._y = y;
    }
    get y() {
        return this._y;
    }
}

class Rect {
    constructor(x, y, w, h) {
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
    }
    set x(x) {
        this._x = x;
    }
    get x() {
        return this._x;
    }
    set y(y) {
        this._y = y;
    }
    get y() {
        return this._y;
    }
    set width(w) {
        this._width = w;
    }
    get width() {
        return this._width;
    }
    set height(h) {
        this._height = h;
    }
    get height() {
        return this._height;
    }
}
//main class
class XST {
    constructor() {
        this.VERSION = '0.5 Beta';
        this._FPS = 60;
        this._width = 640;
        this._height = 480;
        this._canvas = null;
        this._context2D = null;
        this._rect = new Rect(0, 0, 0, 0);
        this._fullScreen = false;
        this._animationID = 0;
        this.CLOSEICON = '';
        this.MAIN_DIV = '';
        this.RGBA = null;
        this.PI = Math.PI;
        this.PI_2 = Math.PI * 2;
        this.palette = [];
        this.OS = ['Windows', 'MacOS', 'UNIX', 'Linux'];
        this._mouseX = null;
        this._mouseY = null;
        this._MB = null;
        this.COLOR = {
            white: '#FFFFFF',
            black: '#000000',
            red: '#FF0000',
            yellow: '#FFFF00',
            salmon: '#FA8072',
            pink: '#FFC0CB',
            orange: '#FFA500',
            violet: '#EE82EE',
            green: '#008000',
            darkgreen: '#006400',
            lime: '#00FF00',
            aqua: '#00FFFF',
            cyan: '#00FFFF',
            blue: '#0000FF',
            darkblue: '#00008B',
            navy: '#000080',
            gray: '#808080',
            silver: '#C0C0C0',
            gold: '#D4AF37',
            aliceblue: '#f0f8ff',
            antiquewhite: '#faebd7',
            aquamarine: '#7fffd4',
            azure: '#f0ffff',
            beige: '#f5f5dc',
            bisque: '#ffe4c4',
            blanchedalmond: '#ffebcd',
            blueviolet: '#8a2be2',
            brown: '#a52a2a',
            burlywood: '#deb887',
            cadetblue: '#5f9ea0',
            chartreuse: '#7fff00',
            chocolate: '#d2691e',
            coral: '#ff7f50',
            cornflowerblue: '#6495ed',
            cornsilk: '#fff8dc',
            crimson: '#dc143c',
            darkblue: '#00008b',
            darkcyan: '#008b8b',
            darkgoldenrod: '#b8860b',
            darkgray: '#a9a9a9',
            darkkhaki: '#bdb76b',
            darkmagenta: '#8b008b',
            darkolivegreen: '#556b2f',
            darkorange: '#ff8c00',
            darkorchid: '#9932cc',
            darkred: '#8b0000',
            darksalmon: '#e9967a',
            darkseagreen: '#8fbc8f',
            darkslateblue: '#483d8b',
            darkslategray: '#2f4f4f',
            darkturquoise: '#00ced1',
            darkviolet: '#9400d3',
            deeppink: '#ff1493',
            deepskyblue: '#00bfff',
            dimgray: '#696969',
            dodgerblue: '#1e90ff',
            firebrick: '#b22222',
            floralwhite: '#fffaf0',
            forestgreen: '#228b22',
            fuchsia: '#ff00ff',
            gainsboro: '#dcdcdc',
            ghostwhite: '#f8f8ff',
            goldenrod: '#daa520',
            greenyellow: '#adff2f',
            honeydew: '#f0fff0',
            hotpink: '#ff69b4',
            indianred: '#cd5c5c',
            indigo: '#4b0082',
            ivory: '#fffff0',
            khaki: '#f0e68c',
            lavender: '#e6e6fa',
            lavenderblush: '#fff0f5',
            lawngreen: '#7cfc00',
            lemonchiffon: '#fffacd',
            lightblue: '#add8e6',
            lightcoral: '#f08080',
            lightcyan: '#e0ffff',
            lightgoldenrodyellow: '#fafad2',
            lightgray: '#d3d3d3',
            lightgrey: '#d3d3d3',
            lightgreen: '#90ee90',
            lightpink: '#ffb6c1',
            lightsalmon: '#ffa07a',
            lightseagreen: '#20b2aa',
            lightskyblue: '#87cefa',
            lightslategray: '#778899',
            lightsteelblue: '#b0c4de',
            lightyellow: '#ffffe0',
            limegreen: '#32cd32',
            linen: '#faf0e6',
            magenta: '#ff00ff',
            maroon: '#800000',
            mediumaquamarine: '#66cdaa',
            mediumblue: '#0000cd',
            mediumorchid: '#ba55d3',
            mediumpurple: '#9370d8',
            mediumseagreen: '#3cb371',
            mediumslateblue: '#7b68ee',
            mediumspringgreen: '#00fa9a',
            mediumturquoise: '#48d1cc',
            mediumvioletred: '#c71585',
            midnightblue: '#191970',
            mintcream: '#f5fffa',
            mistyrose: '#ffe4e1',
            moccasin: '#ffe4b5',
            navajowhite: '#ffdead',
            oldlace: '#fdf5e6',
            olive: '#808000',
            olivedrab: '#6b8e23',
            orangered: '#ff4500',
            orchid: '#da70d6',
            palegoldenrod: '#eee8aa',
            palegreen: '#98fb98',
            paleturquoise: '#afeeee',
            palevioletred: '#d87093',
            papayawhip: '#ffefd5',
            peachpuff: '#ffdab9',
            peru: '#cd853f',
            plum: '#dda0dd',
            powderblue: '#b0e0e6',
            purple: '#800080',
            rosybrown: '#bc8f8f',
            royalblue: '#4169e1',
            saddlebrown: '#8b4513',
            sandybrown: '#f4a460',
            seagreen: '#2e8b57',
            seashell: '#fff5ee',
            sienna: '#a0522d',
            skyblue: '#87ceeb',
            slateblue: '#6a5acd',
            slategray: '#708090',
            snow: '#fffafa',
            springgreen: '#00ff7f',
            steelblue: '#4682b4',
            tan: '#d2b48c',
            teal: '#008080',
            thistle: '#d8bfd8',
            tomato: '#ff6347',
            turquoise: '#40e0d0',
            wheat: '#f5deb3',
            whitesmoke: '#f5f5f5',
            yellowgreen: '#9acd32',
        };
        this.FONT = {
            type: '30px Arial',
            color: 'blue',
        };
        this.color = this.COLOR.white;
        this.backColor = this.COLOR.black;
        this.foreColor = this.COLOR.blue;
        this.linewidth = 1;
        this.strokestyle = '';
        this.numimgs = 0;
        this.images = [];
        this.cacheImages = {};
        this.cacheSound = {};
        this.CALLBACK = undefined;
        this.keys = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            PAUSE: 19,
            CAPS: 20,
            K_ESC: 27,
            K_SPACE: 32,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            K_LEFT: 37,
            K_UP: 38,
            K_RIGHT: 39,
            K_DOWN: 40,
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
        };
        this.key = [];
        this.bank = {};
    }
    print(to_print) {
        console.log(to_print);
    }
    set canvas(canvas) {
        this._canvas = canvas;
    }
    get canvas() {
        return this._canvas;
    }
    set context2D(ctx) {
        this._context2D = ctx;
    }
    get context2D() {
        return this._context2D;
    }
    set fps(fps) {
        this._FPS = fps;
    }
    get fps() {
        return this._FPS;
    }
    set fullScreen(fullScreen) {
        this._fullScreen = fullScreen;
    }
    get fullScreen() {
        return this._fullScreen;
    }
    set rect(rect) {
        this._rect = rect;
    }
    get rect() {
        return this._rect;
    }
    set mouseX(mousex) {
        this._mouseX = mousex;
    }
    get mouseX() {
        return this._mouseX;
    }
    set mouseY(mousey) {
        this._mouseY = mousey;
    }
    get mouseY() {
        return this._mouseY;
    }
    set mb(mb) {
        this._MB = mb;
    }
    get mb() {
        return this._MB;
    }
}

const xst = new XST();
var isFullScreen = xst.fullScreen;

function winScreen(width, height, fullscreen, title) {
    fullscreen = fullscreen || false;
    xst.fullScreen = fullscreen;
    title = title || 'XST3 - Untitled';
    width = width || xst.rect.width;
    height = height || xst.rect.height;

    if (fullscreen) {
        width = window.innerWidth;
        height = window.innerHeight;
        document.title = title;
    } else {
        var tmp_frag = document.createDocumentFragment();
        var div_header = document.createElement('div');
        tmp_frag.appendChild(div_header);
        div_header.style.backgroundColor = xst.COLOR.silver;
        div_header.setAttribute('id', 'div_header');
        div_header.style.width = width + 'px';
        div_header.style.border = '3px solid ' + xst.COLOR.silver;

        var div_panel = document.createElement('div');
        div_panel.setAttribute('id', 'div_panel');
        div_panel.setAttribute('width', width + 'px');
        div_panel.setAttribute('height', '150px');
        var icon = document.createElement('img');
        icon.setAttribute('id', 'icon');
        icon.setAttribute('src', 'xst.ico');
        icon.setAttribute('width', '16px');
        icon.setAttribute('height', '16px');
        div_panel.appendChild(icon);
        icon.style.cssFloat = 'left';
        var div = document.createElement('div');
        div.style.with = '100px';
        div.style.cssFloat = 'right';
        div.style.color = 'black';
        var canc = document.createElement('img');
        canc.src = 'del_ico.png';
        xst.CLOSEICON = canc;
        div.appendChild(canc);
        div_panel.appendChild(div);
        var div_t = document.createElement('div');
        div_t.setAttribute('id', 'div_title');
        div_t.style.cssFloat = 'left';
        div_t.style.color = 'black';
        div_t.style.margin = '0px 2px';
        div_t.innerText = title;
        div_panel.style.margin = '0px 3px 5px 3px';
        div_panel.appendChild(div_t);
    }

    var screen2D = document.createElement('canvas');
    screen2D.setAttribute('width', width + 'px');
    screen2D.setAttribute('height', height + 'px');
    screen2D.setAttribute('id', 'screen2D');
    screen2D.setAttribute('background', 'transparent');

    if (!fullscreen) {
        div_header.appendChild(div_panel);
        div_header.appendChild(screen2D);
        document.body.appendChild(tmp_frag);
    } else {
        screen2D.style.position = 'absolute';
        screen2D.style.top = 0;
        screen2D.style.left = 0;
        document.body.appendChild(screen2D);
    }

    xst.canvas = screen2D;
    xst.context2D = xst.canvas.getContext('2d');
    xst.rect = new Rect(0, 0, width, height);

    xst.context2D.fillStyle = xst.backColor;
    xst.context2D.fillRect(xst.rect.x, xst.rect.y, xst.rect.width, xst.rect.height);

    xst.animationID = requestAnimation(_update);
    xst.MAIN_DIV = div_header;
    screen2D = null;
    initEvents();
}

function moveDiv(e) {
    var div = getComponent('div_header');
    div.style.position = 'absolute';
    div.style.zIndex = 1000;
    div.ondragstart = function() {
        return false;
    };
    moveAt(div, event.pageX, event.pageY);
}

function moveAt(div, pageX, pageY) {
    div.style.left = pageX - div.offsetWidth / 2 + 'px';
    div.style.top = pageY - div.offsetHeight / 2 + 'px';
}

function openCanvas(id) {
    var parent = getComponent('div_header');
    var new_layer = document.createElement('canvas');
    var rect = XST.canvas.getBoundingClientRect();
    new_layer.setAttribute('id', id);
    new_layer.setAttribute('width', XST.canvas.width + 'px');
    new_layer.setAttribute('height', XST.canvas.height + 'px');
    /*new_layer.style.position = 'absolute';
    new_layer.style.left = rect.x;
    new_layer.style.top = rect.y;//rect.top;*/
    //new_layer.style.right = rect.right;
    //new_layer.style.bottom = rect.bottom;

    new_layer.style.zIndex = XST.zIndexManager.inc();
    XST.zIndexManager.el.id = id;
    XST.zIndexManager.el.layer = new_layer;
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
    text = text || 'XST3 - Untitled';
    if (xst.fullScreen) {
        document.title = '';
        document.title = text;
    } else {
        var title = getComponent('div_title');
        title.innerText = '';
        title.innerText = text;
        title = null;
    }
}

function getTitle() {
    if (xst.fullScreen) {
        return document.title;
    } else {
        return getComponent('div_title').innerText;
    }
}

function setIcon(path) {
    if (xst.fullScreen) {
        var icon = getComponent('icon');
        icon.src = '';
        icon.src = path;
        icon.style.width = '16px';
        icon.style.height = '16px';
    }
}

function getComponent(id) {
    return document.getElementById(id);
}

function initEvents() {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    xst.canvas.addEventListener('click', onClick, false);
    xst.canvas.addEventListener('mousemove', onMouseMove, false);
    xst.canvas.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener(
        'contextmenu',
        function(e) {
            e.preventDefault();
        },
        false
    );
    xst.canvas.addEventListener('mouseup', onMouseUp, false);
    xst.canvas.addEventListener('touchstart', onTouchStart, false);
    xst.canvas.addEventListener('touchmove', onTouchMove, false);
    if (xst.fullScreen) {
        window.addEventListener('resize', resizeCanvas, false);
    }

    /*XST.CLOSEICON.addEventListener('click', function(event) {
        XST.MAIN_DIV.hidden = true;
    });*/

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
    e = fixpageXY(e);
    var rect = xst.canvas.getBoundingClientRect();
    xst.mouseX = e.clientX - rect.left;
    xst.mouseY = e.clientY - rect.top;
    xst._MB = e.button;
    rect = null;
    xst.mouseClick = true;
}

function getMouseButton() {
    if (xst._MB === 0) {
        return 'LMB';
    } else if (xst._MB === 2) {
        return 'RMB';
    }
    return false;
}

function onMouseUp(e) {
    e = e || window.event;
    e = fixpageXY(e);
    var rect = xst.canvas.getBoundingClientRect();
    xst.mouseX = e.clientX - rect.left;
    xst.mouseY = e.clientY - rect.top;
    xst._MB = undefined;
    rect = null;
    xst.mouseClick = false;
    xst.canvas.removeEventListener('mousemove', onMouseMove);
}

function mouseOnClick() {
    if (xst.mouseClick !== undefined) {
        return xst.mouseClick;
    }
    return false;
}

function initKeys() {
    var x = void 0;
    for (x in xst.keys) {
        if (Object.prototype.hasOwnProperty.call(xst.keys, x)) {
            xst.key[x] = 0;
        }
    }
}

function setKey(value) {
    var key = void 0;
    for (key in xst.keys) {
        if (Object.prototype.hasOwnProperty.call(xst.keys, key)) {
            if (xst.keys[key] === value) {
                return key;
            }
        }
    }
    return null;
}

function isKeyDown(key) {
    return xst.key[xst.keys[key]] === 1;
}

function onKeyDown(e) {
    e = e || window.event;
    xst.key[e.keyCode] = 1;
}

function onKeyUp(e) {
    e = e || window.event;
    xst.key[e.keyCode] = 0;
}

function getKey() {
    let len = xst.key.length;
    for (let x = 0; x < len; x++) {
        if (xst.key[x] === 1) {
            return setKey(x);
        }
    }
    return 'unknown key';
}

function onMouseMove(e) {
    e = e || window.event;
    e = fixpageXY(e);
    var rect = xst.canvas.getBoundingClientRect();
    xst.mouseX = (e.clientX - rect.left); //e.offsetX;//e.pageX;
    xst.mouseY = (e.clientY - rect.top); //e.offsetY;//e.pageY;
    rect = null;
    xst.isMouseMoving = true;
    moveAt(getComponent('div_header'), e.pageX, e.pageY);
}

function resizeCanvas(e) {
    xst.canvas.width = xst.rect.width = window.innerWidth;
    xst.canvas.height = xst.rect.height = window.innerHeight;
    repaint(xst.CALLBACK);
}

function onResize(func) {
    xst.CALLBACK = func;
}

function repaint(func) {
    if (func) {
        clear();
        func();
    }
}

function isMouseMoving() {
    if (xst.isMouseMoving !== undefined) {
        return xst.isMouseMoving;
    }
    return false;
}

function getMouseX() {
    return xst.mouseX || 0;
}

function getMouseY() {
    return xst.mouseY || 0;
}

function getMouseState() {
    return {
        x: getMouseX(),
        y: getMouseY(),
        LMB: xst._MB === 0 ? true : false,
        RMB: xst._MB === 2 ? true : false,
    };
}

function clear(color) {
    var rect = xst.rect;
    if (color) {
        xst.context2D.fillStyle = color;
        xst.context2D.fillRect(rect.x, rect.y, rect.width, rect.height);
    } else {
        xst.context2D.fillStyle = xst.backColor;
        xst.context2D.clearRect(rect.x, rect.y, rect.width, rect.height);
        xst.context2D.fillRect(rect.x, rect.y, rect.width, rect.height);
    }
    rect = null;
}

function getDocumentBody() {
    return document.body;
}

function setDocumentBodyColor(color) {
    var body = getDocumentBody();
    body.style.backgroundColor = color;
}

function getCanvasContext() {
    return xst.context2D;
}

function getCanvas() {
    return xst.canvas;
}

function getRect() {
    return xst.rect;
}

function rgb(r, g, b) {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function rgba(r, g, b, a) {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}
//0-... 0-100%, 0-100%
function hsl(hue, sat, light) {
    return 'hsl(' + hue + ',' + sat + '%,' + light + '%)';
}

function hsla(hue, sat, light, alpha) {
    return 'hsla(' + hue + ',' + sat + '%,' + light + '%,' + alpha + ')';
}

function setBackColor(color) {
    xst.backColor = color;
    clear();
}

function setColor(color) {
    xst.foreColor = color;
}

function getColor() {
    return xst.foreColor;
}

function getRandomColor() {
    var rgb_model = new ColorRGB();
    rgb_model.setValues(floor(rnd(256)), floor(rnd(256)), floor(rnd(256)));
    return rgb_model.getRGB();
}

function getRandomRGBA() {
    var rgba_model = new ColorRGBA();
    rgba_model.setValues(floor(rnd(256)), floor(rnd(256)), floor(rnd(256)), rnd());
    return rgba_model.getRGBA();
}

function palette() {
    var colors = Array.prototype.slice.call(arguments);
    var len = colors.length;
    var x = 0;
    for (x = 0; x < len; x++) {
        xst.palette[x] = colors[x];
    }
}

function color(index) {
    index = index || 0;
    var _len = xst.palette.length;
    if (index >= 0 && index <= _len) {
        return xst.palette[index];
    }
}

function setColorHSV(h, s, v) {
    return new ColorHSV(h, s, v);
}

function setHSVToRGB(colorhsv) {
    return _HSVtoRGB(colorhsv);
}

function _HSVtoRGB(colorHSV) {
    var h = colorHSV.h / 256;
    var s = colorHSV.s / 256;
    var v = colorHSV.v / 256;
    var r = 0,
        g = 0,
        b = 0;

    if (s === 0) {
        r = g = b = v;
    } else {
        h = h * 6; //hs / 60;
        var i = floor(h);
        var f = h - i;

        var p = v * (1 - s);
        var q = v * (1 - s * f);
        var t = v * (1 - s * (1 - f));

        switch (i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
            default:
                r = g = b = 0;
                break;
        }
    }
    return new ColorRGB(int(r * 255), int(g * 255), int(b * 255));
}

function RGBtoINT(colorRGB) {
    return 65536 * (colorRGB.r + 256) * (colorRGB.g + colorRGB.b);
}

function INTtoRGB(colorINT) {
    return new ColorRGB((colorINT / 65536) % 256, (colorINT / 65536) % 256, (colorINT / 256) % 256);
}

function createImageData(w, h) {
    return xst.context2D.createImageData(w, h);
}

function getImageData(sx, sy, sw, sh) {
    return xst.context2D.getImageData(sx, sy, sw, sh);
}

function putImageData(imgData, x, y, xdirty, ydirty, swdirty, shdirty) {
    if (xdirty) {
        xst.context2D.putImageData(imgData, x, y, xdirty, ydirty, swdirty, shdirty);
    } else {
        xst.context2D.putImageData(imgData, x, y);
    }
}

function setPixel(imgData, x, y, r, g, b, a) {
    var index = (x + y * imgData.width) * 4;
    imgData.data[index] = r;
    imgData.data[index + 1] = g;
    imgData.data[index + 2] = b;
    imgData.data[index + 3] = a;
}

function getPixel(imgData, x, y) {
    var index = (x + y * imgData.width) * 4;
    var pixel = {
        r: imgData.data[index],
        g: imgData.data[index + 1],
        b: imgData.data[index + 2],
        a: imgData.data[index + 3],
    };
    return pixel;
}

/*
 * source-over 	-> Default. Displays the source image over the destination image
 * source-atop 	-> Displays the source image on top of the destination image. The part of the source image that is outside the destination image is not shown
 * source-in 	-> Displays the source image in to the destination image. Only the part of the source image that is INSIDE the destination image is shown, and the destination image is transparent
 * source-out 	-> Displays the source image out of the destination image. Only the part of the source image that is OUTSIDE the destination image is shown, and the destination image is transparent
 * destination-over -> Displays the destination image over the source image
 * destination-atop -> Displays the destination image on top of the source image. The part of the destination image that is outside the source image is not shown
 * destination-in 	-> Displays the destination image in to the source image. Only the part of the destination image that is INSIDE the source image is shown, and the source image is transparent
 * destination-out 	-> Displays the destination image out of the source image. Only the part of the destination image that is OUTSIDE the source image is shown, and the source image is transparent
 * lighter 	-> Displays the source image + the destination image
 * copy 	-> Displays the source image. The destination image is ignored
 * xor 	-> The source image is combined by using an exclusive OR with the destination image
 */
function getGlobalCompositeOperation(prop) {
    prop = prop || 'source-over';
    xst.context2D.globalCompositeOperation = prop;
}

function rect(x, y, width, height, linewidth, bordercolor) {
    xst.context2D.beginPath();
    xst.context2D.lineWidth = linewidth || xst.linewidth;
    xst.context2D.strokeStyle = bordercolor || xst.color;
    xst.context2D.rect(x, y, width, height);
    xst.context2D.stroke();
    xst.context2D.closePath();
}

function fillRect(x, y, width, height, color) {
    xst.context2D.fillStyle = color || xst.color;
    xst.context2D.fillRect(x, y, width, height);
    xst.context2D.stroke();
}

function line(x1, y1, x2, y2, linewidth, color) {
    xst.context2D.strokeStyle = color || xst.color;
    xst.context2D.beginPath();
    xst.context2D.moveTo(x1, y1);
    xst.context2D.lineTo(x2, y2);
    xst.context2D.lineWidth = linewidth || xst.linewidth;
    xst.context2D.stroke();
    xst.context2D.closePath();
}

function drawPixel(x, y, color) {
    xst.context2D.fillStyle = color || xst.color;
    xst.context2D.fillRect(x, y, 1, 1);
}

function circle(x, y, radius, bordercolor) {
    xst.context2D.beginPath();
    xst.context2D.arc(x, y, radius, 0, 2 * xst.PI, true);
    xst.context2D.strokeStyle = bordercolor || xst.color;
    xst.context2D.stroke();
    xst.context2D.closePath();
}

function fillCircle(x, y, radius, fillcolor) {
    xst.context2D.beginPath();
    xst.context2D.arc(x, y, radius, 0, 2 * xst.PI, false);
    xst.context2D.fillStyle = fillcolor || xst.color;
    xst.context2D.fill();
}
/*not implemented yet.*/
function ellipse(x, y, w, h, color) {
    var context = xst.context2D;
    context.translate(x + w / 2, y + h / 2);
    context.scale(w / 2, h / 2);
    context.beginPath();
    context.arc(0, 0, 1, 0, xst.PI * 2, false);
    context.strokeStyle = color;
    context.stroke();
    context = null;
}

function star(x, y, s, color) {
    var c = xst.context2D;
    color = color || xst.COLOR.white;
    c.strokeStyle = color;
    c.beginPath();
    c.moveTo(x, y + s * 0.4);
    c.lineTo(x + s, y + s * 0.4);
    c.lineTo(x + s * 0.15, y + s * 0.9);
    c.lineTo(x + s / 2, y);
    c.lineTo(x + s * 0.85, y + s * 0.9);
    c.lineTo(x, y + s * 0.4);
    c.stroke();
    c = null;
}

function fillStar(x, y, s, color) {
    var c = xst.context2D;
    color = color || xst.COLOR.white;
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(x, y + s * 0.4);
    c.lineTo(x + s, y + s * 0.4);
    c.lineTo(x + s * 0.15, y + s * 0.9);
    c.lineTo(x + s / 2, y);
    c.lineTo(x + s * 0.85, y + s * 0.9);
    c.lineTo(x, y + s * 0.4);
    c.fill();
    c = null;
}

function bar(x, y, x1, y1, color) {
    color = color || xst.backColor;
    var tmp;
    var rect = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
    };

    if (x1 < x) {
        tmp = x1;
        x1 = x;
        x = tmp;
    }
    if (y1 < y) {
        tmp = y1;
        y1 = y;
        y = tmp;
    }

    rect.x = x;
    rect.y = y;
    rect.w = x1 - x + 1;
    rect.h = y1 - y + 1;

    fillRect(rect.x, rect.y, rect.w, rect.h, color);
    rect = null;
}

function saveCanvas() {
    xst.context2D.save();
}

function translate(x, y) {
    xst.context2D.translate(x, y);
}

function rotate(angle) {
    xst.context2D.rotate(angle);
}

function scale(x, y) {
    xst.context2D.scale(x, y);
}

function restoreCanvas() {
    xst.context2D.restore();
}

function timeStamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function setFps(fps) {
    fps = fps || xst._FPS;
    xst._FPS = fps;
}

function getFps() {
    return xst._FPS;
}

function pause(flag) {
    xst.isPaused = flag;
}

function _update() {
    var then = timeStamp(); //Date.now();
    var interval = 1000 / getFps();
    return (function loop() {
        if (!xst.isPaused) {
            xst.animationID = requestAnimation(loop);
            var now = timeStamp(); //Date.now();
            var delta = now - then;
            if (delta > interval) {
                then = now - (delta % interval);
                main();
            }
        }
    })(0);
}

//create some kind of tracer with slot so we can see if this image is loaded or not.
function loadTexture(path, slot) {
    var image;
    if (path) {
        if (xst.cacheImages[path.substring(0, path.indexOf('.'))]) {
            image.src = xst.cacheImages[path.substring(0, path.indexOf('.'))].image;
            return image;
        } else {
            image = new Image();
            image.onload = function() {
                xst.cacheImages[path.substring(0, path.indexOf('.'))] = {};
                xst.cacheImages[path.substring(0, path.indexOf('.'))].image = image;
                xst.cacheImages[path.substring(0, path.indexOf('.'))].slot = slot;
                xst.cacheImages[path.substring(0, path.indexOf('.'))].isLoaded = true;
            };
            image.src = path;
            return image;
        }
    }
}

function isTextureLoaded(slot) {
    if (xst.cacheImages) {
        for (var prop in xst.cacheImages) {
            if (xst.cacheImages.hasOwnProperty(prop)) {
                if (xst.cacheImages[prop].slot === slot) {
                    return xst.cacheImages[prop].isLoaded;
                }
            }
        }
    }
    return false;
}

//Must check if image is loaded
function drawTexture(img, x, y) {
    x = x || 0;
    y = y || 0;
    if (isImage(img)) {
        var img_name = img.src.substring(img.src.lastIndexOf('/') + 1);
        var f_img = img_name.substring(0, img_name.indexOf('.'));
        if (xst.cacheImages[f_img]) {
            xst.context2D.drawImage(img, x, y);
        } else {
            xst.context2D.drawImage(img, x, y);
        }
    }
}

function setColorKey() {}

function hasAudio() {
    if (window.Audio) {
        return true;
    }
    return false;
}

function loadAudio(audio) {
    var sound = document.createElement('audio');
    document.body.appendChild(sound);
    //sound.canPlayType('audio/ogg; codecs="vorbis"');
    if (xst.cacheSound[audio.substring(0, audio.indexOf('.'))]) {
        sound.src = xst.cacheSound[audio.substring(0, audio.indexOf('.'))];
        return sound;
    } else {
        xst.cacheSound[audio.substring(0, audio.indexOf('.'))] = audio;
        sound.src = audio;
    }
    return sound;
}

function playAudio(audio) {
    if (audio) {
        audio.play();
    }
}

function pauseAudio(audio) {
    if (audio) {
        audio.pause();
    }
}

function stopAudio(audio) {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}

function setFont(size, name) {
    xst.FONT.type = size + 'px ' + name;
}

function getFont() {
    return xst.FONT.type;
}

function textAlign(align) {
    align = align || 'center';
    xst.context2D.textAlign = align;
}

function textBaseline(baseline) {
    baseline = baseline || 'middle';
    xst.context2D.textBaseline = baseline;
}

function measureText(text) {
    return xst.context2D.measureText(text);
}

function drawText(text, x, y, color) {
    xst.context2D.lineWidth = getLineWidth();
    xst.context2D.fillStyle = color || xst.foreColor;
    xst.context2D.font = xst.FONT.type;
    xst.context2D.fillText(text, x, y);
}

function setLineWidth(linewidth) {
    xst.linewidth = linewidth || 1;
}

function getLineWidth() {
    return xst.linewidth;
}

function strokeText(text, x, y, color, fillcolor) {
    var style = '';
    color !== undefined ? (style = color) : (style = xst.foreColor);
    xst.context2D.lineWidth = getLineWidth();
    xst.context2D.strokeStyle = style;
    xst.context2D.font = xst.FONT.type;
    xst.context2D.strokeText(text, x, y);
    if (fillcolor) {
        xst.context2D.fillStyle = fillcolor;
        xst.context2D.fillText(text, x, y);
    }
}

function createGradient(x0, y0, x1, y1) {
    xst.gradient = xst.context2D.createLinearGradient(x0, y0, x1, y1);
}

function gradientAddColor(num, color) {
    xst.gradient.addColorStop(num, color);
}

function getGradient() {
    return xst.gradient;
}

function createRadialGradient(x0, y0, r0, x1, y1, r1) {
    xst.radialgradient = xst.context2D.createRadialGradient(x0, y0, r0, x1, y1, r1);
}

function radialGradientAddColor(num, color) {
    xst.radialgradient.addColorStop(num, color);
}

function getRadialGradient() {
    return xst.radialgradient;
}

function Entitie(type, img, x, y) {
    this.type = type || '';
    this.image = loadTexture(img) || '';
    this.x = x || 0;
    this.y = y || 0;
    this.width = getImageWidth(this.image) || 0;
    this.height = getImageHeight(this.image) || 0;
}

function entitieCollide(obj1, obj2) {
    if (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    ) {
        return true;
    }
    return false;
}

function getScreenWidth() {
    return xst.rect.width;
}

function getWindowWidth() {
    return getScreenWidth();
}

function getScreenHeight() {
    return xst.rect.height;
}

function getWindowHeight() {
    return getScreenHeight();
}

function getNumberOfImages() {
    return xst.numimgs;
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
    if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2) {
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
const abs = (val) => Math.abs(val);
const floor = (val) => Math.floor(val);
const acos = (val) => Math.acos(val);
const asin = (val) => Math.asin(val);
const atan = (val) => Math.atan(val);
const atan2 = (val1, val2) => Math.atan2(val1, val2); 
const cos = (param) => Math.cos(param);
const exp = (param) => Math.exp(param);
const log = (param) => Math.log(param);
const rnd = (val) => {if(val) {return Math.random() * val;} return Math.random();} 
const round = (param) => Math.round(param);
const sin = (param) => Math.sin(param);
const sqrt = (param) => Math.sqrt(param);
const tan = (param) => Math.tan(param);
//function int(params)   { return ~~params; }
const int = (param) => round(param);
function val(params) {
    return params - '0';
} /*+(params) || params*1*/
const = randomReal => (xmax, xmin) => rnd(xmax - xmin) + xmin;
const randomInt = (xmin, xmax) => int(rnd((xmax + 1) - xmin) + xmin);
const min = (a, b) => (a > b) ? b: a;
const max = (a, b) => (a > b) ? a: b;
const pow = (a, b) => Math.pow(a, b);
const deg2Rad = deg => (XST.PI / 180) * deg;
const rad2Deg = rad => (180 / XST.PI) * rad;

function decToBin(i) {
    var buf = '';
    var ret = '';
    while (i > 0) {
        if (i % 2 === 0) {
            buf += '0';
        } else {
            buf += '1';
        }
        i = parseInt(i / 2);
    }
    var l = buf.length;
    for (var x = 0; x < l; x++) {
        ret += buf[l - x - 1];
    }
    return ret;
}

/*function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}*/
const dec2bin = (dec) => (dec >> 0).toString(2);
/*function bin2dec(bin) {
    return parseInt(bin, 2).toString(10);
}*/
const bin2dec = (bin) => parseInt(bin, 2).toString(10);
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
const left$ = (string, num) => string.substring(0, num); 
const len$ = (string) => string.length;
const mid$ = (string, start, num) => string.substring(start, start + num);
const right$ = (string, num) => string.substring(len$(string)-num, len$(string));
const trim$ = (string) => string.trim();
const uppercase = (string) => string.toUpperCase();
const tolower = (string) => string.toLowerCase();
/*end of the string functions*/

/*fix the coords in canvas*/
function fixpageXY(e) {
    if (e.pageX === null && e.clientX != null) {
        var html = document.documentElement;
        var body = document.body;
        e.pageX = e.clientX + (html.scrollLeft || (body && body.scrollLeft) || 0);
        e.pageX -= html.clientLeft || 0;
        e.pageY = e.clientY + (html.scrollTop || (body && body.scrollTop) || 0);
        e.pageY -= html.clientTop || 0;
    }
    return e;
}
/*smoth animation*/
function requestAnimation(what) {
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(what) {
            window.setTimeout(what, 1000 / getFps());
        };
    return requestAnimationFrame(what);
}

function stopAnimation(requestID) {
    var stopAnimationFrame =
        window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        function(requestID) {
            clearTimeout(requestID);
        };
    stopAnimationFrame(requestID);
}

const stop = () => stopAnimation(XST.animationID);
const getVersion = () => XST.VERSION;

function getOS() {
    if (window.navigator) {
        var Os = navigator.appVersion;
        if (Os.indexOf('Win') != -1) return xst.OS[0];
        if (Os.indexOf('Mac') != -1) return xst.OS[1];
        if (Os.indexOf('X11') != -1) return xst.OS[2];
        if (Os.indexOf('Linux') != -1) return xst.OS[3];
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
    if (min < 10) min = '0' + min;
    var secs = dat.getSeconds();
    if (secs < 10) secs = '0' + secs;
    return hour + ':' + min + ':' + secs;
}

const getHour = () => new Date().getHours();
const getMinutes = () => new Date().getMinutes();
const getSeconds = () => new Date().getSeconds();
const ticks = () => timeStamp();
let wait = (nsec) => setTimeout(nsec);
const dummy = () => { };
/*End of time functions*/
/*
 * @simple vector object
 */

class Vector {
    constructor() {
        this._x = 0;
        this._y = 0;
        this._angle = 0;
    }
    set x(x) {
        this._x = x;
    }
    get x() {
        return this._x;
    }
    set y(y) {
        this._y = y;
    }
    get y() {
        return this._y;
    }
    set angle(angle) {
        this._angle = angle;
    }
    get angle() {
        return this._angle;
    }
}

/*var Vector = {
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
    },
    norm: function() {
        var magnitude = this.mag();
        if (magnitude !== 0) {
            this.div(magnitude);
        }
    },
    mag: function() {
        return sqrt(this._x * this._x + this._y * this._y);
    }
};
*/
/*console.log text for debugging*/
//this one logs into console.log from browser
function print(text) {
    xst.print(text);
}

/**
 * @uses stack class
 * @Memory banks test
 * @param {any} bank
 * @param {any} number
 */
function reserveBank(bank, number) {
    bank = bank || 0;
    number = number || 0;
    if (xst.bank[bank] === undefined) {
        xst.bank[bank] = new Stack(number);
    }
}

function poke(bank, slot, data) {
    if (xst.bank[bank]) {
        if (xst.bank[bank].index < xst.bank[bank].size) {
            xst.bank[bank].push({
                slot: slot,
                data: data,
            });
        }
    }
}

function peke(bank, slot) {
    if (xst.bank[bank]) {
        return xst.bank[bank].search(slot);
    }
}

/*experimental functions*/
function extend(obj, props) {
    for (let prop in props) {
        if (Object.prototype.hasOwnProperty.call(props, prop)) {
            obj[prop] = props[prop];
        }
    }
    return obj;
}

//extend(XST, {extend: extend});

/*colors size and colors in engine*/
function engineColorsLen() {
    return Object.keys(xst.COLOR).length;
}

function engineColors() {
    let color = void 0;
    for (color in xst.COLOR) {
        if (Object.prototype.hasOwnProperty.call(xst.COLOR, color)) {
            print(color + ' : ' + xst.COLOR[color]);
        }
    }
}
/*end of colors in engine*/

//var xst = Object.create(XST);
/*alias*/
const COLOR = xst.COLOR;
const PI = xst.PI;
const PI_2 = xst.PI_2;
let drawpixel = void 0;
const pset = (drawpixel = drawPixel);

function main() {}
main();
/*const main = () => {};
main();*/
/*end alias*/

//XST.create = Object.create;
//end of experimental functions

/*clear memory*/
function close() {
    xst.rect = null;
    xst.COLOR = null;
    xst.FONT = null;
    xst.cacheImages = null;
    xst.cacheSound = null;
    xst.keys = null;
    xst = null;
    COLOR = null;
}
window.onclose = function() {close();};
