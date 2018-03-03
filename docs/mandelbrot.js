(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var palettes = {
    "default": [
        new Uint8ClampedArray([  9,   1,  47, 255]),
        new Uint8ClampedArray([  4,   4,  73, 255]),
        new Uint8ClampedArray([  0,   7, 100, 255]),
        new Uint8ClampedArray([ 12,  44, 138, 255]),
        new Uint8ClampedArray([ 24,  82, 177, 255]),
        new Uint8ClampedArray([ 57, 125, 209, 255]),
        new Uint8ClampedArray([134, 181, 229, 255]),
        new Uint8ClampedArray([211, 236, 248, 255]),
        new Uint8ClampedArray([241, 233, 191, 255]),
        new Uint8ClampedArray([248, 201,  95, 255]),
        new Uint8ClampedArray([255, 170,   0, 255]),
        new Uint8ClampedArray([204, 128,   0, 255]),
        new Uint8ClampedArray([153,  87,   0, 255]),
        new Uint8ClampedArray([106,  52,   3, 255]),
        new Uint8ClampedArray([66,   30,  15, 255]),
        new Uint8ClampedArray([25,    7,  26, 255])
    ],
    "grey": [
        new Uint8ClampedArray([  0,   0,   0, 255]),
        new Uint8ClampedArray([ 16,  16,  16, 255]),
        new Uint8ClampedArray([ 32,  32,  32, 255]),
        new Uint8ClampedArray([ 48,  48,  48, 255]),
        new Uint8ClampedArray([ 64,  64,  64, 255]),
        new Uint8ClampedArray([ 80,  80,  80, 255]),
        new Uint8ClampedArray([ 96,  96,  96, 255]),
        new Uint8ClampedArray([112, 112, 112, 255]),
        new Uint8ClampedArray([128, 128, 128, 255]),
        new Uint8ClampedArray([144, 144, 144, 255]),
        new Uint8ClampedArray([160, 160, 160, 255]),
        new Uint8ClampedArray([176, 176, 176, 255]),
        new Uint8ClampedArray([192, 192, 192, 255]),
        new Uint8ClampedArray([210, 210, 210, 255]),
        new Uint8ClampedArray([228, 228, 228, 255]),
        new Uint8ClampedArray([255, 255, 255, 255])
    ],
    "ultra-fractal-5": [
        new Uint8ClampedArray([  0,  7,  100, 255]),
        new Uint8ClampedArray([  4,  32, 154, 255]),
        new Uint8ClampedArray([ 21,  84, 191, 255]),
        new Uint8ClampedArray([ 54, 142, 218, 255]),
        new Uint8ClampedArray([119, 194, 239, 255]),
        new Uint8ClampedArray([185, 234, 250, 255]),
        new Uint8ClampedArray([230, 254, 255, 255]),
        new Uint8ClampedArray([249, 251, 226, 255]),
        new Uint8ClampedArray([252, 232, 122, 255]),
        new Uint8ClampedArray([255, 199,  25, 255]),
        new Uint8ClampedArray([249, 149,   0, 255]),
        new Uint8ClampedArray([156,  81,   0, 255]),
        new Uint8ClampedArray([44,   22,   0, 255]),
        new Uint8ClampedArray([0,     2,   2, 255]),
        new Uint8ClampedArray([0,     4,  38, 255]),
        new Uint8ClampedArray([0,     6, 100, 255])
    ]
};

function makeRGB(C, H, m, alpha) {
    let X = C * (1 - Math.abs((H % 2) - 1));
    let RGB = [0, 0, 0];

    if (H >= 0 && H < 1) {
        RGB = [C, X, 0];
    } else if (H >= 1 && H < 2) {
        RGB = [X, C, 0];
    } else if (H >= 2 && H < 3) {
        RGB = [0, C, X];
    } else if (H >= 3 && H < 4) {
        RGB = [0, X, C];
    } else if (H >= 4 && H < 5) {
        RGB = [X, 0, C];
    } else if (H >= 5 && H <= 6) {
        RGB = [C, 0, X];
    }

    let buffer = new Uint8ClampedArray(4);

    buffer[0] = Math.round((RGB[0] + m) * 255);
    buffer[1] = Math.round((RGB[1] + m) * 255);
    buffer[2] = Math.round((RGB[2] + m) * 255);
    buffer[3] = Math.round(alpha * 255);

    return buffer;
}

function HSL2RGB(hue, saturation, lightness, alpha = 1) {
    let C = (1 - Math.abs(2*lightness - 1)) * saturation;
    let H = hue/60.0;
    let m = lightness - C/2;

    return makeRGB(C, H, m, alpha);
}

function HSV2RGB(hue, saturation, value, alpha = 1) {
    let C = value * saturation;
    let H = hue/60.0;
    let m = value - C;

    return makeRGB(C, H, m, alpha);
}

function interpolate(color1, color2, fraction) {
    return new Uint8ClampedArray([
        color1[0] + (color2[0] - color1[0]) * fraction,
        color1[1] + (color2[1] - color1[1]) * fraction,
        color1[2] + (color2[2] - color1[2]) * fraction,
        color1[3] + (color2[3] - color1[3]) * fraction
    ]);
}


exports.HSL2RGB = HSL2RGB;
exports.HSV2RGB = HSV2RGB;
exports.interpolate = interpolate;
exports.palettes = palettes;

},{}],2:[function(require,module,exports){

var colors = require("./colors.js");

class MandelbrotSetFormula
{
    constructor({iterations = 100, radius = 2**4, smooth = true} = {}) {
        this.iterations = iterations;
        this.radius = radius;
        this.smooth = smooth;
        this.defaultExtent = MandelbrotSetFormula.extent;
    }

    calculate(Cr, Ci) {
        let Zr = 0, Zi = 0, Tr = 0, Ti = 0;

        for (let i = 0; i < this.iterations; ++i) {
            Zi = 2*Zr*Zi + Ci;
            Zr = Tr - Ti + Cr;
            Tr = Zr*Zr;
            Ti = Zi*Zi;

            if (Tr + Ti > this.radius) {
                return i + 1 - Math.log(Math.log(Math.sqrt(Tr + Ti)))/Math.log(2);
                //return i + 1 - Math.log((Math.log(Tr + Ti)/2)/Math.log(2)) / Math.log(2);
            }
        }

        return null;
    }
}

MandelbrotSetFormula.extent = {
    x_min: -2.5,
    x_max:  1.0,
    y_min: -1.5,
    y_max:  1.5
};

class JuliaSetFormula {
    calculate(Zr, Zi) {
        let z = Math.sqrt(Tr + Ti);
        let smoothValue = Math.exp(-z);

        for (let i = 0; i < this.iterations && z < 30; ++i) {
            //z = f(z);
            //smoothcolor += Math.exp(-z);
        }
    }
}

JuliaSetFormula.extent = {
    x_min: -2.5,
    x_max:  1.0,
    y_min: -1.5,
    y_max:  1.5
};


class FractalGenerator {
    constructor({
        width = 2000,
        height = 2000,
        formula = null,
        extent = null,
        interior = false,
        axes = false,
        palette = "default"
    } = {}) {
        this.width = width;
        this.height = height;

        if (null == formula) {
            throw new Error('Formula must be set');
        }

        this.formula = formula;

        if (null == extent) {
            extent = formula.defaultExtent;
        }

        this.extent = extent;

        this.interior = interior;
        this.axes = axes;
        this.palette = colors.palettes[palette];

        this.adjustExtent();
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.adjustExtent();
    }

    setExtent(extent) {
        this.extent = extent;
        this.adjustExtent();
    }

    adjustExtent() {
        let width  = this.extent.x_max - this.extent.x_min;
        let height = this.extent.y_max - this.extent.y_min;

        let [x_step, y_step] = [width / this.width, height / this.height];

        if (y_step > x_step) {
            this.step = y_step;
            let d = (this.width * this.step - width) / 2;
            this.x_min = this.extent.x_min - d;
            this.x_max = this.extent.x_max + d;
            this.y_min = this.extent.y_min
            this.y_max = this.extent.y_max
        } else {
            this.step = x_step;
            let d = (this.height * this.step - height) / 2;
            this.x_min = this.extent.x_min;
            this.x_max = this.extent.x_max;
            this.y_min = this.extent.y_min - d;
            this.y_max = this.extent.y_max + d;
        }
    }

    getExtentValueAt(x, y) {
        return [this.x_min + x * this.step, this.y_min + y * this.step];
    }

    calculate(x, y) {
        let [Er, Ei] = this.getExtentValueAt(x, y);

        if (this.axes && ((Er < this.step && Er >= 0) || (Ei < this.step && Ei >= 0))) {
            return colors.palettes["grey"][10];
        }

        let value = this.formula.calculate(Er, Ei);

        if (null === value) {
            return this.interior ?
                colors.palettes["grey"][15]:
                colors.palettes["grey"][0];
        }

        let hue = Math.log(0.02 * value + 1);

        while (hue > 1) {
            hue--;
        }

        hue *= (this.palette.length - 1);
        let hue1 = Math.max(Math.floor(hue), 0);
        let hue2 = Math.min(hue1 + 1, this.palette.length - 1);

        return colors.interpolate(
            this.palette[hue1],
            this.palette[hue2],
            hue - hue1
        );
    }

    /**
     * Pixel by pixel generator
     */
    *pixelGenerator() {
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                yield this.calculate(x, y);
            }
        }
    }

    /**
     * Line by line generator
     */
    *lineGenerator() {
        for (let y = 0; y < this.height; ++y) {
            let buffer = new Uint8ClampedArray(this.width*4);

            for (let x = 0; x < this.width; ++x) {
                buffer.set(this.calculate(x, y), 4*x);
            }

            yield buffer;
        }
    }
}

exports.MandelbrotSetFormula = MandelbrotSetFormula;
exports.FractalGenerator = FractalGenerator;

},{"./colors.js":1}],3:[function(require,module,exports){

;(function(window, document, history) {

    var mandelbrot = require("../mandelbrot-set.js");
/*
    var app = (function(window, document) {

        // Drawing canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Processing indicator
        this.processing = document.createElement('div');
        this.processing.className = 'processing';
        this.processing.innerHTML = '<p>Rendering...</p>';

        // Status box
        this.status = document.createElement('div');
        this.status.className = 'status';

        // Selection rectange
        this.selection = document.createElement('div');
        this.selection.className = 'selection';

        this.init = function() {
            var body = document.getElementsByTagName('body')[0];
            body.appendChild(this.processing);
            body.appendChild(this.canvas);
            body.appendChild(this.status);
        };

        this.context = function() {
            this.canvas.getContext('2d');
        };

    })(window, document);
*/

    function time() {
        return (new Date).getTime();
    }

    function encodeURIQuery(params) {
        return Object.keys(params).map(k => {
            let value = params[k];
            if (value !== null && typeof value === 'object') {
                return encodeURIQuery(value);
            }

            return k + '=' + encodeURIComponent(value);
        }).join('&');
    }

    function decodeURIQuery(query) {
        if (query.startsWith('?')) {
            query = query.substring(1);
        }

        let result = {};
        for (let pair of query.split('&')) {
            let [key, value] = pair.split('=').map((x) => {
                return decodeURIComponent(x);
            });

            result[key] = value;
        }

        return result;
    }

    function isEquivalent(a, b) {
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }


    document.addEventListener("DOMContentLoaded", function(event) {

        var processing = document.createElement("div");
        processing.id = 'processing';
        processing.style.display = 'none';
        document.getElementsByTagName('body')[0].appendChild(processing);

        var content = document.getElementById('content');
        var canvas = document.createElement('canvas');
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        content.appendChild(canvas);

        var statusBar = document.createElement("div");
        statusBar.id = 'status-bar';
        content.appendChild(statusBar);

        var extentInfo = document.createElement("div");
        extentInfo.id = 'extent-info';
        statusBar.appendChild(extentInfo);

        var summary = document.createElement("div");
        summary.id = 'summary';
        statusBar.appendChild(summary);

        var selection = document.createElement("div");
        selection.id = 'selection';
        content.appendChild(selection);

        var formulaClass = "MandelbrotSetFormula";

        var defaultExtent = mandelbrot[formulaClass].extent;

        var defaultIterations = 100;

        var defaultRadius = 2**8;

        var initialState = (function() {
            let params = decodeURIQuery(window.location.search);
            let extent = Object.assign({}, defaultExtent);

            for (let key of Object.keys(extent)) {
                if (key in params) {
                    let value = parseFloat(params[key]);
                    if (isFinite(value)) {
                        extent[key] = value;
                    }
                }
            }

            let iterations = null, radius = null;

            if ('iterations' in params) {
                let value = parseInt(params['iterations']);
                if (isFinite(value)) {
                    iterations = value;
                }
            }

            if ('radius' in params) {
                let value = parseInt(params['radius']);
                if (isFinite(value)) {
                    radius = value;
                }
            }

            if (null === iterations || null === radius) {
                let zoom = calculateZoom(extent);
                if (null === iterations) {
                    iterations = calculateIterations(zoom);
                }

                if (null === radius) {
                    radius = calculateRadius(zoom);
                }
            }

            let state = {extent, iterations, radius};
            // Always update/rewrite current history state
            history.replaceState(state, "", "?" + encodeURIQuery(state));
            return state;
        })();

        var formula = new mandelbrot.MandelbrotSetFormula({
            iterations: initialState.iterations,
            radius: initialState.radius,
            smooth: true
        });

        var fractal = new mandelbrot.FractalGenerator({
            width: window.innerWidth,
            height: window.innerHeight,
            formula: formula,
            extent: initialState.extent,
            interior: false,
            axes: true,
            palette: "ultra-fractal-5"
        });

        var drag = {
            enabled: false,
            xs: 0,
            ys: 0,
            x:  0,
            y:  0
        };

        var drawing = {
            currentLine: 0,
            timeout: null,
            context: canvas.getContext('2d'),
            generator: null,
            started: 0,
            draw: function(timeout = 66) {
                clearTimeout(this.timeout);

                this.timeout = setTimeout(() => {
                    if (canvas.width != fractal.width || canvas.height != fractal.height) {
                        canvas.width = fractal.width;
                        canvas.height = fractal.height;
                    }

                    selection.style.display = 'none';
                    selection.style.pointerEvents = 'none';
                    processing.style.display = 'block';
                    processing.style.top = statusBar.offsetHeight;
                    summary.innerHTML = `iterations: ${formula.iterations}, radius: ${formula.radius}`;

                    this.started = time();

                    // Initialize generator and start drawing
                    this.currentLine = 0;
                    this.generator = fractal.lineGenerator();
                    this.drawNextLine();
                }, timeout);
            },
            drawNextLine: function() {
                let result = this.generator.next();
                if (!result.done) {
                    this.context.putImageData(new ImageData(result.value, fractal.width, 1), 0, this.currentLine++);
                    processing.style.top = Math.max(this.currentLine, statusBar.offsetHeight);
                    if (0 == this.currentLine % 25) {
                        this.timeout = setTimeout(() => { this.drawNextLine(); }, 0);
                    } else {
                        this.drawNextLine();
                    }
                } else {
                    processing.style.display = 'none';
                    summary.innerHTML = `iterations: ${formula.iterations}, radius: ${formula.radius},  ${time() - this.started} ms`;
                }
            }
        };

        function setState(state = {}) {
            let newState = {
                extent: fractal.extent,
                iterations: formula.iterations,
                radius: formula.radius
            };

            Object.assign(newState, state);

            formula.iterations = newState.iterations;
            formula.radius = newState.radius;
            fractal.setExtent(newState.extent);

            return newState;
        };

        function pushState(state = {}) {
            state = setState(state);
            if (history.state && isEquivalent(history.state, state)) {
                return;
            }

            history.pushState(state, "", "?" + encodeURIQuery(state));
        };

        function calculateZoom(extent) {
            return Math.max(
                (defaultExtent.x_max - defaultExtent.x_min) /
                (extent.x_max - extent.x_min),
                (defaultExtent.y_max - defaultExtent.y_min) /
                (extent.y_max - extent.y_min)
            );
        };

        function calculateExtent() {
            let [x_min, y_min] = fractal.getExtentValueAt(
                Math.min(drag.xs, drag.x),
                Math.min(drag.ys, drag.y)
            );
            let [x_max, y_max] = fractal.getExtentValueAt(
                Math.max(drag.xs, drag.x),
                Math.max(drag.ys, drag.y)
            );

            return {x_min, x_max, y_min, y_max};
        };

        function calculateIterations(zoom) {
            return Math.min(10000, Math.floor(defaultIterations * Math.max(1,
                Math.log2(zoom+1)
            )));
        };

        function calculateRadius(zoom) {
            return defaultRadius;
        };

        window.addEventListener('popstate', function(e) {
            if (e.state) {
                setState(e.state)
                drawing.draw();
            }
        });

        window.addEventListener('load', function(e) {
            drawing.draw();
        });

        window.addEventListener('resize', function() {
            fractal.setSize(window.innerWidth, window.innerHeight);
            drawing.draw(1000);
        });

        selection.addEventListener('click', function(e) {
            drag.enabled = false;
            let extent = calculateExtent();
            let zoom = calculateZoom(extent);
            pushState({
                iterations: calculateIterations(zoom),
                radius: calculateRadius(zoom),
                extent: extent
            });

            drawing.draw();
        });

        canvas.addEventListener('mousedown', function(e) {
            if (!drag.enabled) {
                selection.style.left = drag.xs = drag.x = e.pageX;
                selection.style.top = drag.ys = drag.y = e.pageY;
                selection.style.width = 0;
                selection.style.height = 0;

                selection.style.display = 'none';
                selection.style.pointerEvents = 'none';

                drag.enabled = true;
            }
        });

        canvas.addEventListener('mousemove', function(e) {
            if (drag.enabled) {
                drag.x = e.pageX;
                drag.y = e.pageY;

                selection.style.display = 'block';
                selection.style.pointerEvents = 'none';

                selection.style.left = Math.min(drag.xs, drag.x);
                selection.style.top = Math.min(drag.ys, drag.y);
                selection.style.width = Math.abs(drag.xs - drag.x);
                selection.style.height = Math.abs(drag.ys - drag.y);

                let extent = calculateExtent();
                extentInfo.innerHTML = `${extent.x_min}, ${extent.y_min}; ${extent.x_max}, ${extent.y_max}`;
            } else if (selection.style.display == 'none') {
                drag.xs = drag.x = e.pageX;
                drag.ys = drag.y = e.pageY;

                let extent = calculateExtent();
                extentInfo.innerHTML = `${extent.x_min}, ${extent.y_min}`;
            }
        });

        canvas.addEventListener('mouseup', function(e) {
            if (drag.enabled) {
                drag.enabled = false;
                selection.style.pointerEvents = 'auto';
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.keyCode == 27) {
                if (selection.style.display == 'block') {
                    drag.enabled = false;
                    selection.style.display = 'none';
                    selection.style.pointerEvents = 'none';
                } else {
                    pushState({
                        iterations: defaultIterations,
                        radius: defaultRadius,
                        extent: defaultExtent
                    });

                    drawing.draw();
                }
            }
        });
    });

})(window, window.document, window.history);
},{"../mandelbrot-set.js":2}]},{},[3]);
