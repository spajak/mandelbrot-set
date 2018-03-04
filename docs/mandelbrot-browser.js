
;(function(window, document, history) {

    var mandelbrot = require("../mandelbrot-set.js");

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